import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';

// Component for value sets.  Currently, this page just redirects to another page
@Component({
  selector: 'app-value-sets',
  templateUrl: './value-sets.component.html',
  styleUrls: ['./value-sets.component.css']
})
export class ValueSetsComponent implements OnInit {
  [x: string]: any;

  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  activeIndex = 0
  valueSetCode: string;
  valueSetDetail: Concept;
  valueSetWithRelationships: Concept;
  direction = 'horizontal';
  hierarchyDisplay = "";
  hierarchyData: TreeNode[]
  selectedNode: any;
  selectedNodes: TreeNode[] = [];
  title: string;

  urlBase = "/valuesets"
  urlTarget = '_blank'

  conceptPanelSize = "70.0"
  valueSetPanelSize = "30.0"

  constructor(
    private valueSetDetailService: ConceptDetailService,
    private location: Location,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Set active index based on cookie unless never set
    // then default to 0
    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;

    this.updateDisplaySize();
    this.valueSetCode = "C54443";
    this.getPathInHierarchy();
  }

  // Handler for tabs changing in the hierarchy view.
  handleChange($event) {
    this.activeIndex = $event.index;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');

    if (($event.index === 1 || $event.index === 2) &&
      (this.valueSetWithRelationships === undefined || this.valueSetWithRelationships == null)) {
      this.valueSetDetailService.getRelationships(this.valueSetCode).subscribe(response => {
        this.valueSetWithRelationships = new Concept(response);
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
    console.info('event code = ' + event.code);
    this.valueSetDetailService
      .getConceptSummary(event.code, 'summary,maps')
      .subscribe((response: any) => {
        this.conceptDetail = new Concept(response);
        this.conceptCode = this.conceptDetail.code;
        this.title = this.conceptDetail.name + ' ( Code - ' + this.conceptDetail.code + ' )';

        this.resetTreeTableNodes();
        this.updateDisplaySize();
      });
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy() {
    console.log(this.valueSetCode);
    this.valueSetDetailService.getHierarchyChildData(this.valueSetCode)
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
    this.valueSetDetailService.getHierarchyChildData(code)
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
    if (node['highlight'] || node['code'] === this.valueSetCode) {
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
