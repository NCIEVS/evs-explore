import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';

import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';

// Hierarchy display component
// BAC - looks like not used (yet?)
@Component({
  selector: 'app-hierarchy-display',
  templateUrl: './hierarchy-display.component.html',
  styleUrls: ['./hierarchy-display.component.css']
})
export class HierarchyDisplayComponent implements OnInit {
  @ViewChild('hierarchyTable', { static: true }) hierarchyTable: TreeTable;

  activeIndex = 0
  conceptCode: string;
  conceptDetail: any;
  conceptRelationships: any;
  direction = 'horizontal';
  hierarchyDisplay = "";
  hierarchyData: TreeNode[]
  selectedNode: any;
  selectedNodes: TreeNode[] = [];
  title: string;

  urlBase = "/hierarchy"
  urlTarget = '_blank'

  /*
   * The properties that are excluded are handled differently
   * than the simple properties, and are in separate sections
   * of the detail output.
   */
  excludeProperties = [
    'ALT_DEFINITION',
    'code',
    'Concept_Status',
    'DEFINITION',
    'Display_Name',
    'FULL_SYN',
    'GO_Annotation',
    'Maps_To',
    'Preferred_Name'
  ]
  properties: string[] = [];

  conceptPanelSize = "70.0"
  hierarchyPanelSize = "30.0"

  constructor(
    private conceptDetailService: ConceptDetailService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.updateDisplaySize();
    this.conceptDetailService.getProperties()
      .subscribe((properties_new: any) => {
        this.properties = []
        for (const property of properties_new) {
          if (!this.excludeProperties.includes(property['name'])) {
            this.properties.push(property['name']);
          }
        }
        this.route.params.subscribe((params: any) => {
          if (params.code) {
            this.conceptDetail = this.route.paramMap.pipe(
              switchMap((params: ParamMap) =>
                this.conceptDetailService
                  .getConceptSummary(params.get('code'))
              )
            )
              .subscribe((concept: any) => {
                this.conceptDetail = concept;
                this.conceptCode = this.conceptDetail.Code;
                this.title = this.conceptDetail.Label + ' ( Code - ' + this.conceptDetail.Code + ' )';
                this.conceptRelationships = undefined;
                this.activeIndex = 0;
                this.getPathInHierarchy();
              })
          }
        });
      })
  }

  handleChange($event) {
    this.activeIndex = $event.index;
    if (($event.index === 1 || $event.index === 2) &&
      (this.conceptRelationships === undefined || this.conceptRelationships == null)) {
      this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
        this.conceptRelationships = response;
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

  treeTableNodeSelected(event) {
    this.conceptDetailService
      .getConceptSummary(event.code)
      .subscribe((concept_new: any) => {
        this.conceptDetail = concept_new;
        this.conceptCode = this.conceptDetail.Code;
        this.title = this.conceptDetail.Label + ' ( Code - ' + this.conceptDetail.Code + ' )';
        this.conceptRelationships = undefined;
        this.activeIndex = 0;
        for (let i = 0; i < this.selectedNodes.length; i++) {
          this.selectedNodes[i]['highlight'] = false;
        }
        this.selectedNodes = [];
        this.resetTreeTableNodes();
        this.updateDisplaySize();
        const newURL = "/hierarchy/" + this.conceptCode;
        this.location.replaceState(newURL);
      });
  }

  getPathInHierarchy() {
    const url = '/api/v1/concept/ncit/' + this.conceptCode + '/pathFromRoot';
    this.conceptDetailService.getHierarchyData(url)
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

  getTreeTableChildrenNodes(code: string, node: any) {
    const url = '/api/v1/concept/ncit/' + code + '/children';
    this.conceptDetailService.getHierarchyData(url)
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

  treeTableNodeExpand(event) {
    if (event.node) {
      this.getTreeTableChildrenNodes(event.node.code, event.node);
    }
  }

  treeTableNodeCollapse(event) {
    setTimeout(() => {
      this.scrollToSelectionTableTree(event.node, this.hierarchyTable);
    }, 100);
  }

  resetTreeTableNodes() {
    for (const node of this.hierarchyData) {
      this.setTreeTableProperties(node);
    }
  }

  deepCopyHierarchyData() {
    this.hierarchyData = [...this.hierarchyData];
  }

  setTreeTableProperties(node: TreeNode) {
    node.collapsedIcon = '';
    node.expandedIcon = '';
    const obj = {
      'code': node['code'],
      'name': node['name'],
      'highlight': false
    }
    if (node['highlight'] || node['code'] === this.conceptCode) {
      this.selectedNodes.push(node);
      obj['highlight'] = true;
    }
    node.data = obj;

    for (const child of node.children) {
      this.setTreeTableProperties(child);
    }
  }

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
