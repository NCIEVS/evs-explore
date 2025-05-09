import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { Concept } from './../../model/concept';
import { ConfigurationService } from '../../service/configuration.service';
import { LoaderService } from '../../service/loader.service';
import { TreeTable } from 'primeng/treetable';

// Hierarchy display component - loaded via the /hierarchy route
@Component({
  selector: 'app-hierarchy-display',
  templateUrl: './hierarchy-display.component.html',
  styleUrls: ['./hierarchy-display.component.css'],
})
export class HierarchyDisplayComponent implements OnInit {
  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  conceptCode: string;
  conceptDetail: Concept;
  conceptWithRelationships: Concept;
  direction = 'horizontal';
  hierarchyDisplay = '';
  hierarchyData: TreeNode[];
  selectedNode: any;
  selectedNodes: TreeNode[] = [];
  terminology: any;
  title: string;

  hierarchyUrl = '/hierarchy/';
  urlTarget = '_top';

  conceptPanelSize = '70.0';
  hierarchyPanelSize = '30.0';

  // For source control
  sources: string[] = [];
  selectedSources = null;

  // display tree position tracking
  displayedPositions;
  totalPositions;
  hierarchyLimit = 10;
  hierarchyIndex = 0;
  hierarchySize = 0;

  constructor(
    private conceptDetailService: ConceptDetailService,
    private router: Router,
    private loaderService: LoaderService,
    public configService: ConfigurationService,
  ) {
    // Do this in the constructor so it's ready to go when this component is injected
    this.configSetup();
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.getPathInHierarchy();
    this.updateDisplaySize();
  }

  configSetup() {
    this.configService.setConfigFromPathname(window.location.pathname);
    this.configService.setConfigFromQuery(window.location.search);
    this.selectedSources = this.configService.getSelectedSources();
    this.conceptCode = this.configService.getCode();
    this.terminology = this.configService.getTerminologyName();
  }

  openHierarchyPopup() {
    this.closeHierarchy();
    this.configService.setTriggerHierarchyPopup(true);
  }

  closeHierarchy() {
    this.router.navigate(['/concept/' + this.terminology + '/' + this.conceptCode]);
  }

  updateDisplaySize = () => {
    const bodyHeight = document.documentElement.scrollHeight;
    document.getElementById('hierarchyTableDisplay').style.height = bodyHeight + 'px';
    /*
     * Adjust the size of the hierarchy display
     */
    let tableHeight = 0;
    if (bodyHeight > 1200) {
      tableHeight = 1200;
    } else {
      tableHeight = bodyHeight;
    }
    this.hierarchyTable.scrollHeight = tableHeight - 200 + 'px';
  };

  // Handler for selecting a tree node
  treeTableNodeSelected(event) {
    // Handle selecting for more data for top level
    if (event.ct && event.data.parentCode === 'root') {
      if (confirm('Loading all tree positions may take a while, are you sure you want to proceed?')) {
        this.getAllPathsInHierarchy();
      }
      setTimeout(() => (this.selectedNode = null), 100);
    } else if (event.ct) {
      // Handle selecting for more data for sibling level
      if (confirm('Loading more data may take a while, are you sure you want to proceed?')) {
        this.getAllTreeTableChildrenNodes(event.data.parentCode, event.data.parentNode);
      }
      setTimeout(() => (this.selectedNode = null), 100);
    } else {
      // Handle selecting a code to navigate away
      this.router.navigate([this.hierarchyUrl + this.terminology + '/' + event.code]);
    }
  }

  getPreviousHierarchyPosition() {
    if (this.hierarchyIndex > 0) {
      this.hierarchyIndex--;
    } else {
      this.hierarchyIndex = this.hierarchySize - 1;
    }
    this.scrollToSelectionTableTree(this.selectedNodes[this.hierarchyIndex], this.hierarchyTable);
  }

  getNextHierarchyPosition() {
    if (this.hierarchyIndex < this.hierarchySize - 1) {
      this.hierarchyIndex++;
    } else {
      this.hierarchyIndex = 0;
    }
    this.scrollToSelectionTableTree(this.selectedNodes[this.hierarchyIndex], this.hierarchyTable);
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy(limit: number = this.hierarchyLimit, loadAll = null) {
    console.log('getPathInHierarchy called');
    this.loaderService.showLoader();
    this.conceptDetailService.getHierarchyData(this.conceptCode, limit).then((nodes) => {
      this.hierarchyData = nodes as TreeNode[];
      if(loadAll) {
        this.selectedNodes = [];
      }
      for (const node of this.hierarchyData) {

        this.setTreeTableProperties(node, null);
      }
      this.updateDisplaySize();
      if (this.selectedNodes.length > 0) {
        this.hierarchySize = this.selectedNodes.length;
        setTimeout(() => {
          this.scrollToSelectionTableTree(this.selectedNodes[this.hierarchyIndex], this.hierarchyTable);
        }, 100);
      }
      this.loaderService.hideLoader();
    });
  }

  getAllPathsInHierarchy(loadAll = null) {
    this.getPathInHierarchy(null, loadAll);
  }

  // Load all tree positions for the selected node
  loadAllPositions(event: Event) {
    event.preventDefault();
    this.getAllPathsInHierarchy(true);
  }

  // Get child tree nodes (for an expanded node)
  getTreeTableChildrenNodes(code: string, node: any, limit: number = 100) {
    this.loaderService.showLoader();
    this.conceptDetailService.getHierarchyChildData(code, limit).then((nodes) => {
      if (limit == null) {
        const codes = new Set(node.children.map((n) => n.code));
        // Remove the 'ct' node and combine the list with the remaining elements
        // NOTE: this may require resorting
        node.children = [...node.children.filter((n) => !n.ct), ...nodes.filter((n) => !codes.has(n['code']))];
      } else {
        node.children = nodes;
      }
      for (const child of node.children) {
        this.setTreeTableProperties(child, node);
      }
      this.deepCopyHierarchyData();
      setTimeout(() => {
        this.scrollToSelectionTableTree(node, this.hierarchyTable);
      }, 100);
      this.loaderService.hideLoader();
    });
  }

  getAllTreeTableChildrenNodes(code: string, node: any) {
    this.getTreeTableChildrenNodes(code, node, null);
  }

  // Handler for expanding a tree node
  treeTableNodeExpand(event) {
    // console.log('treeTableNodeExpand', event.node);
    if (event.node) {
      this.getTreeTableChildrenNodes(event.node.code, event.node);
    }
  }

  // Handler for collapsing a tree node
  treeTableNodeCollapse(event) {
    // console.log('treeTableNodeCollapse', event.node);
    setTimeout(() => {
      this.scrollToSelectionTableTree(event.node, this.hierarchyTable);
    }, 100);
  }

  // Deep copy of hierarchy data
  deepCopyHierarchyData() {
    // console.log('deep copy hierarchy data');
    this.hierarchyData = [...this.hierarchyData];
  }

  // Reset tree node properties
  setTreeTableProperties(node: TreeNode, parentNode: TreeNode) {
    // console.log('set tree table properties', node);
    node.collapsedIcon = '';
    node.expandedIcon = '';
    const obj = {
      code: node['code'],
      label: node['label'],
      highlight: false,
    };
    if (node['highlight'] || node['code'] === this.conceptCode) {
      this.selectedNodes.push(node);
      obj['highlight'] = true;
    }
    node.data = obj;

    if (!node.children) {
      node.children = [];
    }

    // Attach info to the 'ct' entry
    if (node['ct']) {
      // Handle a 'more data' siblings situation
      if (parentNode) {
        node.data.label = '... More data (' + node['ct'] + ')';
        node.data.parentCode = parentNode['code'];
        node.data.parentNode = parentNode;
      } else {
        this.totalPositions = node['ct'];
      }
    } else {
      this.totalPositions = 0;
    }
    // should be equal to the limit passed in getPathInHierarchy call
    this.displayedPositions = this.hierarchyLimit;

    for (const child of node.children) {
      this.setTreeTableProperties(child, node);
    }
  }

  // Scroll to the selected node - oy!
  scrollToSelectionTableTree(selectedNode, hierarchyTable) {
    // console.log('scroll to selection', selectedNode);
    let index = 0;
    let selectedNodeIndex = 0;
    const hierarchyRows = this.hierarchyTable.el.nativeElement.querySelectorAll('.p-treetable-tbody>tr');
    for (let i = 0; i < hierarchyRows.length; i++) {
      const testLabel = hierarchyRows[i]['innerText'].trim();
      if (testLabel === selectedNode.label) {
        if(selectedNodeIndex++ == this.hierarchyIndex) {
          index = i;
          break;
        }
      }
    }
    if (this.hierarchyTable.el.nativeElement.querySelectorAll('.p-treetable-tbody>tr')[index] !== undefined) {
      this.hierarchyTable.el.nativeElement.querySelectorAll('.p-treetable-tbody>tr')[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
      setTimeout(() => {
        document.getElementById('header-top').scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
        });
      }, 100);
    }
  }

  keepSource(item: string): boolean {
    return item && item !== 'NCIMTH' && item !== 'MTH';
  }

  getSourceList(concept) {
    // console.log('get source list', concept);
    const sourceList = new Set<string>();
    sourceList.add('All');
    for (const obj in concept.synonyms) {
      if (this.keepSource(concept.synonyms[obj].source)) {
        sourceList.add(concept.synonyms[obj].source);
      }
    }
    for (const obj in concept.properties) {
      if (this.keepSource(concept.properties[obj].source)) {
        sourceList.add(concept.properties[obj].source);
      }
    }
    for (const obj in concept.associations) {
      if (this.keepSource(concept.associations[obj].source)) {
        sourceList.add(concept.associations[obj].source);
      }
    }
    for (const obj in concept.inverseAssociations) {
      if (this.keepSource(concept.inverseAssociations[obj].source)) {
        sourceList.add(concept.inverseAssociations[obj].source);
      }
    }

    // If there is no overlap between sourceList and selectedSources, clear selectedSources
    const intersection = [...sourceList].filter((x) => this.selectedSources.has(x));
    if (intersection.length === 0) {
      this.toggleSelectedSource('All');
    }

    // Convert set to array and return
    return [...sourceList];
  }

  toggleSelectedSource(source) {
    // clear if All is selected or was last selected
    if (source === 'All' || (this.selectedSources.size === 1 && this.selectedSources.has('All'))) {
      this.selectedSources.clear();
    }
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
      // reset to All if removing last selected source
      if (this.selectedSources.size === 0) {
        this.selectedSources.add('All');
      }
    } else {
      this.selectedSources.add(source);
    }
  }
}
