import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  selector: 'subsets',
  templateUrl: './subsets.component.html',
  styleUrls: ['./subsets.component.css']
})
export class SubsetsComponent implements OnInit {
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

  urlBase = "/subsets"
  urlTarget = '_blank'

  conceptPanelSize = "70.0"
  valueSetPanelSize = "30.0"

  constructor(
    private valueSetDetailService: ConceptDetailService,
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
    let tableHeight = bodyHeight;
    this.hierarchyTable.scrollHeight = (tableHeight - 200) + "px";
  }

  // Handler for selecting a tree node
  treeTableNodeSelected(event) {
    console.info('treeTableNodeSelected', event);
    console.info('event code = ' + event.code);
    this.title = event.name + ' ( Code - ' + event.code + ' )';
    this.resetTreeTableNodes();
    this.updateDisplaySize();
    const url = this.router.serializeUrl(this.router.createUrlTree(['/subset/'+event.code]));
    window.open(url, '_blank');
  }

  // Gets path in the hierarchy and scrolls to the active node
  getPathInHierarchy() {
    this.valueSetDetailService.getValueSetTopLevel()
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
  getTreeTableChildrenNodes(code: string, nodeChildren: any) {
      for (const child of nodeChildren) {
        this.setTreeTableProperties(child);
      }
      this.deepCopyHierarchyData();
      setTimeout(() => {
        this.scrollToSelectionTableTree(nodeChildren, this.hierarchyTable);
      }, 100);
  }

  // Handler for expanding a tree node
  treeTableNodeExpand(event) {
    console.log('treeTableNodeExpand', event.node);
    if (event.node) {
      this.getTreeTableChildrenNodes(event.node.code, event.node.children);
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
