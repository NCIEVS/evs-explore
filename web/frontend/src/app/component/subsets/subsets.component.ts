import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';

// Component for value sets.  Currently, this page just redirects to another page
@Component({
  selector: 'subsets',
  templateUrl: './subsets.component.html',
  styleUrls: ['./subsets.component.css']
})
export class SubsetsComponent implements OnInit {
  [x: string]: any;

  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  activeIndex = 0
  subsetCode: string;
  subsetDetail: Concept;
  subsetWithRelationships: Concept;
  direction = 'horizontal';
  hierarchyDisplay = "";
  hierarchyData: TreeNode[]
  selectedNode: any;
  selectedNodes: TreeNode[] = [];
  title: string;
  expand = true;

  urlBase = "/subsets"
  urlTarget = '_blank'

  conceptPanelSize = "70.0"
  subsetPanelSize = "30.0"

  constructor(
    private subsetDetailService: ConceptDetailService,
    private location: Location,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    // Set active index based on cookie unless never set
    // then default to 0
    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;

    this.updateDisplaySize();
    this.getPathInHierarchy();
  }

  // Handler for tabs changing in the hierarchy view.
  handleChange($event) {
    this.activeIndex = $event.index;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');

    if (($event.index === 1 || $event.index === 2) &&
      (this.subsetWithRelationships === undefined || this.subsetWithRelationships == null)) {
      this.subsetDetailService.getRelationships(this.subsetCode).subscribe(response => {
        this.subsetWithRelationships = new Concept(response);
      });
    }
  }

  updateDisplaySize = () => {
    let bodyHeight = document.documentElement.scrollHeight
    document.getElementById('hierarchyTableDisplay').style.height = bodyHeight + "px";
    /*
     * Adjust the size of the hierarchy display
    */
    let tableHeight = bodyHeight;
    this.hierarchyTable.scrollHeight = (tableHeight - 200) + "px";
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy() {
    this.subsetDetailService.getSubsetTopLevel()
      .then(nodes => {

        this.hierarchyData = <TreeNode[]>nodes;
        for (const node of this.hierarchyData) {
          this.setTreeTableProperties(node);
        }
        this.updateDisplaySize();
        if (this.selectedNodes.length > 0) {
          setTimeout(() => {
            this.scrollToSelectionTableTree(this.selectedNodes[0]);
          }, 100);
        }

      });
  }

  // Get child tree nodes (for an expanded node)
  getTreeTableChildrenNodes(nodeChildren: any) {
      for (const child of nodeChildren) {
        this.setTreeTableProperties(child);
      }
      this.deepCopyHierarchyData();
      setTimeout(() => {
        this.scrollToSelectionTableTree(nodeChildren);
      }, 100);
  }

  clearTreeTableChildrenNodes(nodeChildren: any) {
    for (const child of nodeChildren) {
      this.setTreeTableProperties(null);
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
      this.setTreeTableProperties(node);
    }
  }

  // Deep copy of hierarchy data
  deepCopyHierarchyData() {
    this.hierarchyData = [...this.hierarchyData];
  }

  // Reset tree node properties
  setTreeTableProperties(node: TreeNode) {
    node.collapsedIcon = '';
    node.expandedIcon = '';
    const obj = {
      'code': node['code'],
      'label': node['name'],
      'highlight': false
    }
    this.selectedNodes.push(node);
    node.data = obj;

    if (!node.children) {
      node.children = [];
    }
    for (const child of node.children) {
      this.setTreeTableProperties(child);
    }
  }

  // Scroll to the selected node - oy!
  scrollToSelectionTableTree(selectedNode) {
    let index = 0;
    const hierarchyRows = this.hierarchyTable.el.nativeElement
      .querySelectorAll('.ui-treetable-tbody>tr');
    for (let i = 0; i < hierarchyRows.length; i++) {
      const testLabel = hierarchyRows[i]['innerText'].trim();
      if (testLabel === selectedNode.label) {
        index = i;
        break;
      }
    }
  }


  expandOrCollapseAllNodes(hierarchyData, element, level = 0){
    if(this.expand){
      for (let i = 0; i < hierarchyData.length; i++) {
        if(hierarchyData[i].children.length > 0){
          this.getTreeTableChildrenNodes(hierarchyData[i].children);
          this.expandOrCollapseAllNodes(hierarchyData[i].children, undefined, level + 1);
          hierarchyData[i].expanded = true;
        }
      }
      if(level == 0){ // make sure everything is finished
        this.expand = false;
        element.textContent = "Collapse All"
      }
    }
    else {
      // TODO: figure out how collapsing works
      this.ngOnInit()
      this.expand = true;
      element.textContent = "Expand All"
      }
    }
  }


