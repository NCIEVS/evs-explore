import { Component, OnInit, ViewChild } from '@angular/core';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { Concept } from './../../model/concept';
import { ConfigurationService } from '../../service/configuration.service';
import { Title } from '@angular/platform-browser';
import { LoaderService } from '../../service/loader.service';
import { TreeTable } from 'primeng/treetable';

@Component({
  selector: 'subsets',
  templateUrl: './subsets.component.html',
  styleUrls: ['./subsets.component.css'],
})
export class SubsetsComponent implements OnInit {
  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  subsetCode: string;
  subsetDetail: Concept;
  subsetWithRelationships: Concept;
  direction = 'horizontal';
  filteredHierarchy: TreeNode[];
  hierarchyDisplay = '';
  hierarchyData: TreeNode[];
  subsetSuggestions: string[] = [];
  title: string;
  expand = true;
  terminology: string;
  subsetsFound = false;
  expandLabel = 'Expand All';
  expandDisabled = false;
  placeholderText = 'Loading Subset Hierarchy...';
  searchDisabled = false;
  enteredSearchText: string; // text from search box
  subsetSearchText: string; // transferred search text

  urlTarget = '_top';

  constructor(
    private subsetDetailService: ConceptDetailService,
    private configService: ConfigurationService,
    private loaderService: LoaderService,
    private titleService: Title
  ) {
    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();
  }

  ngOnInit() {
    this.titleService.setTitle('EVS Explore - Subsets');
    this.getPathInHierarchy();
    this.subsetsFound = true;
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy() {
    console.log('getPathInHierarchy', this.configService.subsets);

    if (this.configService.subsets === null) {
      this.searchDisabled = true;
      this.loaderService.showLoader();
      this.subsetDetailService.getSubsetTopLevel().then((nodes) => {
        this.hierarchyData = (nodes as TreeNode[]);
        for (const node of this.hierarchyData) {
          this.setTreeTableProperties(node, false);
        }
        this.configService.subsets = JSON.parse(
          JSON.stringify(this.hierarchyData)
        );
        this.sortNcitFirst();
        this.placeholderText = 'Enter at least 3 letters of a subset.';
        this.searchDisabled = false;
        this.loaderService.hideLoader();
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

  // Deep copy of hierarchy data
  deepCopyHierarchyData() {
    this.hierarchyData = [...this.hierarchyData];
  }

  // Reset tree node properties
  setTreeTableProperties(node: TreeNode, child: boolean) {
    node.collapsedIcon = '';
    node.expandedIcon = '';
    const obj = {
      code: node['code'],
      label: node['name'],
      highlight: false,
      root: !child,
    };
    node.data = obj;

    if (!node.children) {
      node.children = [];
    }
    for (const child of node.children) {
      this.setTreeTableProperties(child, true);
    }
  }

  scrollToSelectionTableTree(selectedNode) {
    let index = 0;
    const hierarchyRows = this.hierarchyTable.el.nativeElement.querySelectorAll(
      '.ui-treetable-tbody>tr'
    );
    for (let i = 0; i < hierarchyRows.length; i++) {
      const testLabel = hierarchyRows[i]['innerText'].trim();
      if (testLabel === selectedNode.label) {
        index = i;
        break;
      }
    }
  }

  // Handle 'expand all' or 'collapse all'
  expandOrCollapseAllNodes(hierarchyData, level = 0) {
    setTimeout(() => this.expandOrCollapseAllNodesHelper(hierarchyData, level));
  }

  expandOrCollapseAllNodesHelper(hierarchyData, level = 0) {
    for (let i = 0; i < hierarchyData.length; i++) {
      if (hierarchyData[i].children.length > 0) {
        this.getTreeTableChildrenNodes(hierarchyData[i].children);
        this.expandOrCollapseAllNodesHelper(
          hierarchyData[i].children,
          level + 1
        );
        // hierarchyData[i].expanded = true;
        hierarchyData[i].expanded = this.expand;
      }
    }
    // Only trigger this for the top-level call
    if (level === 0) {
      this.expand = !this.expand;
      if (!this.expand) {
        this.expandLabel = 'Collapse All';
      } else {
        this.expandLabel = 'Expand All';
      }
    }
  }

  performSubsetSearch() {
    this.subsetSearchText = this.enteredSearchText;
    this.loaderService.showLoader();
    setTimeout(() => {
      this.expandDisabled = true;
      this.filteredHierarchy = [];
      this.hierarchyData = JSON.parse(
        JSON.stringify(this.configService.subsets)
      );
      this.hierarchyData.forEach((element) => {
        const newTn = this.performSubsetSearchHelper(
          element,
          this.subsetSearchText
        );
        if (newTn) {
          this.filteredHierarchy.push(element);
        }
      });
      this.subsetSuggestions = []; // deal with the spinner
      this.subsetsFound = this.filteredHierarchy.length > 0;
      this.hierarchyData = this.filteredHierarchy;
      this.sortNcitFirst();
      this.loaderService.hideLoader();
    });
  }

  performSubsetSearchHelper(tn, string) {
    const newChildren = new Array();
    if (tn.children) {
      tn.children.forEach((element) => {
        const newChild = this.performSubsetSearchHelper(element, string);
        if (newChild) {
          newChildren.push(newChild);
        }
      });
    }
    if (
      newChildren.length !== 0 ||
      !tn.name.toLowerCase().includes(string.toLowerCase()) ||
      !tn.code.toLowerCase().includes(string.toLowerCase())
    ) {
      tn.children = newChildren;
      tn.expanded = true;
    }
    return tn.name.toLowerCase().includes(string.toLowerCase()) ||
      tn.code.toLowerCase().includes(string.toLowerCase()) ||
      tn.children.length > 0
      ? tn
      : null;
  }

  hasText(codeAndLabel) {
    return (
      this.subsetSearchText &&
      codeAndLabel.toLowerCase().includes(this.subsetSearchText.toLowerCase())
    );
  }

  resetSearch() {
    this.enteredSearchText = null;
    this.subsetSearchText = null;
    this.expand = true;
    this.expandLabel = 'Expand All';
    this.expandDisabled = false;
    this.hierarchyData = JSON.parse(JSON.stringify(this.configService.subsets));
    this.sortNcitFirst();
  }
  NCItermFirst() {
    throw new Error('Method not implemented.');
  }

  sortNcitFirst() {
    this.hierarchyData = this.hierarchyData
      .filter((r) =>
        r.data.label.includes('National Cancer Institute Terminology')
      )
      .concat(
        this.hierarchyData.filter(
          (r) => !r.data.label.includes('National Cancer Institute Terminology')
        )
      );
  }
}
