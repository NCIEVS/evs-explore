import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';
import { Concept } from './../../model/concept';

// Hierarchy display component - loaded via the /hierarchy route
@Component({
  selector: 'app-hierarchy-display',
  templateUrl: './hierarchy-display.component.html',
  styleUrls: ['./hierarchy-display.component.css']
})
export class HierarchyDisplayComponent implements OnInit {
  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  activeIndex = 0
  conceptCode: string;
  conceptDetail: Concept;
  conceptWithRelationships: Concept;
  direction = 'horizontal';
  hierarchyDisplay = "";
  hierarchyData: TreeNode[]
  selectedNode: any;
  selectedNodes: TreeNode[] = [];
  title: string;

  urlBase = "/hierarchy"
  urlTarget = '_blank'

  conceptPanelSize = "70.0"
  hierarchyPanelSize = "30.0"

  constructor(
    private conceptDetailService: ConceptDetailService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.updateDisplaySize();
    this.route.params.subscribe((params: any) => {
      if (params.code) {
        this.route.paramMap.pipe(
          switchMap((params: ParamMap) =>
            this.conceptDetailService
              .getConceptSummary(params.get('code'), 'summary,maps')
          )
        )
          .subscribe((response: any) => {
            this.conceptDetail = new Concept(response);
            this.conceptCode = this.conceptDetail.code;
            this.title = this.conceptDetail.name + ' ( Code - ' + this.conceptDetail.code + ' )';
            this.conceptWithRelationships = undefined;
            this.activeIndex = 0;
            this.getPathInHierarchy();
          })
      }
    });

  }

  // Handler for tabs changing in the hierarchy view.
  handleChange($event) {
    this.activeIndex = $event.index;
    if (($event.index === 1 || $event.index === 2) &&
      (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
      this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
        this.conceptWithRelationships = new Concept(response);
      });
    }
  }

  updateDisplaySize = () => {
    let bodyHeight = document.documentElement.scrollHeight
    document.getElementById('hierarchyTableDisplay').style.height = bodyHeight + "px";
    /*
     * Adjust the size of the hierarchy display
    */
    let tableHeight = 0;
    if (bodyHeight > 1200) {
      tableHeight = 1200;
    } else {
      tableHeight = bodyHeight
    }
    this.hierarchyTable.scrollHeight = (tableHeight - 200) + "px";
  }

  // Handler for selecting a tree node
  treeTableNodeSelected(event) {
    console.info('treeTableNodeSelected', event);
    this.conceptDetailService
      .getConceptSummary(event.code, 'summary,maps')
      .subscribe((response: any) => {
        this.conceptDetail = new Concept(response);
        this.conceptCode = this.conceptDetail.code;
        this.title = this.conceptDetail.name + ' ( Code - ' + this.conceptDetail.code + ' )';
        this.conceptWithRelationships = undefined;
        this.activeIndex = 0;
        this.getPathInHierarchy();
        for (let i = 0; i < this.selectedNodes.length; i++) {
          this.selectedNodes[i]['highlight'] = false;
        }
        this.selectedNodes = [];
        this.resetTreeTableNodes();
        this.updateDisplaySize();
        this.location.replaceState("/hierarchy/" + this.conceptCode);
      });
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy() {
    this.conceptDetailService.getHierarchyData(this.conceptCode)
      .then(nodes => {

        this.hierarchyData = <TreeNode[]>nodes;
        for (const node of this.hierarchyData) {
          this.setTreeTableProperties(node);
        }
        this.updateDisplaySize();
        if (this.selectedNodes.length > 0) {
          setTimeout(() => {
            this.scrollToSelectionTableTree(this.selectedNodes[0], this.hierarchyTable);
          }, 100);
        }

      });
  }

  // Get child tree nodes (for an expanded node)
  getTreeTableChildrenNodes(code: string, node: any) {
    this.conceptDetailService.getHierarchyChildData(code)
      .then(nodes => {
        node.children = nodes;
        for (const child of node.children) {
          this.setTreeTableProperties(child);
        }
        this.deepCopyHierarchyData();
        setTimeout(() => {
          this.scrollToSelectionTableTree(node, this.hierarchyTable);
        }, 100);
      });
  }

  // Handler for expanding a tree node
  treeTableNodeExpand(event) {
    console.log('treeTableNodeExpand', event.node);
    if (event.node) {
      this.getTreeTableChildrenNodes(event.node.code, event.node);
    }
  }

  // Handler for collapsing a tree node
  treeTableNodeCollapse(event) {
    console.log('treeTableNodeCollapse', event.node);
    setTimeout(() => {
      this.scrollToSelectionTableTree(event.node, this.hierarchyTable);
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
      'label': node['label'],
      'highlight': false
    }
    if (node['highlight'] || node['code'] === this.conceptCode) {
      this.selectedNodes.push(node);
      obj['highlight'] = true;
    }
    node.data = obj;

    if (!node.children) {
      node.children = [];
    }
    for (const child of node.children) {
      this.setTreeTableProperties(child);
    }
  }

  // Scroll to the selected node - oy!
  scrollToSelectionTableTree(selectedNode, hierarchyTable) {
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
    if (this.hierarchyTable.el.nativeElement.querySelectorAll('.ui-treetable-tbody>tr')[index] !== undefined) {
      this.hierarchyTable.el.nativeElement.querySelectorAll('.ui-treetable-tbody>tr')[index]
        .scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  }

}
