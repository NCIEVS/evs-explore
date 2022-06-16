import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../../service/configuration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'subsets',
  templateUrl: './subsets.component.html',
  styleUrls: ['./subsets.component.css']
})
export class SubsetsComponent implements OnInit {
  [x: string]: any;

  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  subsetCode: string;
  subsetDetail: Concept;
  subsetWithRelationships: Concept;
  direction = 'horizontal';
  filteredHierarchy: TreeNode[]
  hierarchyDisplay = "";
  hierarchyData: TreeNode[];
  subsetSuggestions: string[] = [];
  title: string;
  expand = true;
  terminology: string;
  subsetsFound = false;
  expandLabel = 'Expand All';
  expandDisabled = false;

  static origHierarchyData: TreeNode[] = null;

  urlBase = "/subsets"
  urlTarget = '_top'

  constructor(
    private subsetDetailService: ConceptDetailService,
    private location: Location,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router,
    private configService: ConfigurationService,
    private titleService: Title
  ) {

    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();
  }

  ngOnInit() {

    this.titleService.setTitle("EVS Explore - Subsets");
    this.getPathInHierarchy();
    this.subsetsFound = true;
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy() {
    console.log('getPathInHierarchy');

    if (SubsetsComponent.origHierarchyData == null) {
      this.hierarchyTable.loading = true;
      this.subsetDetailService.getSubsetTopLevel()
        .then(nodes => {
          console.log('get subset top level');
          this.hierarchyData = <TreeNode[]>nodes;
          for (const node of this.hierarchyData) {
            this.setTreeTableProperties(node, false);
          }
          console.log('copy hierarchy data');
          SubsetsComponent.origHierarchyData = JSON.parse(JSON.stringify(this.hierarchyData));
          console.log('done copy hierarchy data');
          this.hierarchyTable.loading = false;
        });
    } else {
      this.resetSearch();
    }
  }

  // Get child tree nodes (for an expanded node)
  getTreeTableChildrenNodes(nodeChildren: any) {
    for (const child of nodeChildren) {
      this.setTreeTableProperties(child, true);
    }
    this.deepCopyHierarchyData();
  }

  clearTreeTableChildrenNodes(nodeChildren: any) {
    for (const child of nodeChildren) {
      this.setTreeTableProperties(child, true);
    }
    this.deepCopyHierarchyData();
  }

  // Handler for expanding a tree node
  treeTableNodeExpand(event) {
    console.log('treeTableNodeExpand', event.node);
    if (event.node) {
      this.getTreeTableChildrenNodes(event.node.children);
    }
  }

  // Handler for collapsing a tree node
  treeTableNodeCollapse(event) {
    console.log('treeTableNodeCollapse', event.node);
    setTimeout(() => {
      this.scrollToSelectionTableTree(event.node);
    }, 100);
  }

  // Reset all table nodes in the hierarchy
  resetTreeTableNodes() {
    for (const node of this.hierarchyData) {
      this.setTreeTableProperties(node, false);
    }
  }

  // Deep copy of hierarchy data
  deepCopyHierarchyData() {
    this.hierarchyData = [...this.hierarchyData];
  }

  // Reset tree node properties
  setTreeTableProperties(node: TreeNode, child: boolean) {
    node.collapsedIcon = '';
    node.expandedIcon = '';
    const obj = {
      'code': node['code'],
      'label': node['name'],
      'highlight': false,
      'root': !child
    }
    node.data = obj;

    if (!node.children) {
      node.children = [];
    }
    for (const child of node.children) {
      this.setTreeTableProperties(child, true);
    }
  }


  // Handle "expand all" or "collapse all"
  expandOrCollapseAllNodes(hierarchyData, level = 0) {
    this.hierarchyTable.loading = true;
    setTimeout(() => this.expandOrCollapseAllNodesHelper(hierarchyData, level));
  }

  expandOrCollapseAllNodesHelper(hierarchyData, level = 0) {
    for (let i = 0; i < hierarchyData.length; i++) {
      if (hierarchyData[i].children.length > 0) {
        this.getTreeTableChildrenNodes(hierarchyData[i].children);
        this.expandOrCollapseAllNodesHelper(hierarchyData[i].children, level + 1);
        // hierarchyData[i].expanded = true;
        hierarchyData[i].expanded = this.expand;
      }
    }
    // Only trigger this for the top-level call
    if (level == 0) {
      this.expand = !this.expand;
      if (!this.expand) {
        this.expandLabel = 'Collapse All';
      } else {
        this.expandLabel = 'Expand All';
      }
      this.hierarchyTable.loading = false;
    }
  }

  performSubsetSearch(string) {
    this.hierarchyTable.loading = true;
    setTimeout(() => {
      this.expandDisabled = true;
      this.filteredHierarchy = [];
      this.hierarchyData = JSON.parse(JSON.stringify(SubsetsComponent.origHierarchyData));
      this.hierarchyData.forEach(element => {
        var newTn = this.performSubsetSearchHelper(element, string);
        if (newTn) {
          this.filteredHierarchy.push(element);
        }
      });
      this.subsetSuggestions = []; // deal with the spinner
      this.subsetsFound = (this.filteredHierarchy.length > 0);
      this.hierarchyData = this.filteredHierarchy;
      this.hierarchyTable.loading = false;
    });
  }

  performSubsetSearchHelper(tn, string) {
    var newChildren = new Array();
    if (tn.children) {
      tn.children.forEach(element => {
        var newChild = this.performSubsetSearchHelper(element, string);
        if (newChild) {
          newChildren.push(newChild);
        }
      });
    }
    if (newChildren.length != 0 || !tn.name.toLowerCase().includes(string.toLowerCase()) || !tn.code.toLowerCase().includes(string.toLowerCase())) {
      tn.children = newChildren;
      tn.expanded = true;
    }
    return (tn.name.toLowerCase().includes(string.toLowerCase()) || tn.code.toLowerCase().includes(string.toLowerCase()) || tn.children.length > 0) ? tn : null;
  }

  resetSearch() {
    this.subsetautosearch = '';
    sessionStorage.setItem("subsetSearch", this.subsetautosearch);
    this.expand = true;
    this.expandLabel = 'Expand All';
    this.expandDisabled = false;
    this.hierarchyData = JSON.parse(JSON.stringify(SubsetsComponent.origHierarchyData));
  }

}

