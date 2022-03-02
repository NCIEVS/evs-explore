import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ConceptDetailService } from './../../service/concept-detail.service';
import { TreeNode } from 'primeng/api';
import { TreeTable } from 'primeng/primeng';
import { Concept } from './../../model/concept';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from '../../service/configuration.service';


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
  terminology: any;
  title: string;

  urlBase = "/hierarchy"
  urlTarget = '_top'

  conceptPanelSize = "70.0"
  hierarchyPanelSize = "30.0"

  // For source control
  sources: string[] = [];
  selectedSources = null;

  constructor(
    private conceptDetailService: ConceptDetailService,
    private location: Location,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public configService: ConfigurationService
  ) {

    // Do this in the constructor so it's ready to go when this component is injected
    this.configService.setConfigFromParameters(this.route.snapshot.paramMap);
    this.configService.setConfigFromParameters(this.route.snapshot.queryParamMap);
    this.selectedSources = this.configService.getSelectedSources();

  }

  ngOnInit() {
    // Set active index based on cookie unless never set
    // then default to 0
    this.activeIndex = this.cookieService.check('activeIndex') ? Number(this.cookieService.get('activeIndex')) : 0;
    this.terminology = this.configService.getTerminologyName();

    this.updateDisplaySize();

    this.conceptDetailService
      .getConceptSummary(this.configService.getCode(), 'summary,maps')
      .subscribe((response: any) => {
        this.conceptDetail = new Concept(response, this.configService);
        this.conceptCode = this.conceptDetail.code;
        this.title = this.conceptDetail.name + ' ( Code - ' + this.conceptDetail.code + ' )';
        // Sort the source list (case insensitive)
        this.sources = this.getSourceList(this.conceptDetail).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        // make sure All is at the front
        if (this.sources[0] != "All" && this.sources.includes("All")) { // make sure All is first in list
          this.sources.splice(this.sources.indexOf("All"), 1);
          this.sources.unshift("All");
        }
        this.conceptWithRelationships = undefined;
        if ((this.activeIndex === 1 || this.activeIndex === 2) &&
          (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
          this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
            this.conceptWithRelationships = new Concept(response, this.configService);
          });
        }
        this.getPathInHierarchy();
      });

  }

  // Handler for tabs changing in the hierarchy view.
  handleChange($event) {
    this.activeIndex = $event.index;
    this.cookieService.set('activeIndex', String(this.activeIndex), 365, '/');

    if (($event.index === 1 || $event.index === 2) &&
      (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
      this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
        this.conceptWithRelationships = new Concept(response, this.configService);
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
        this.conceptDetail = new Concept(response, this.configService);
        this.conceptCode = this.conceptDetail.code;
        this.title = this.conceptDetail.name + ' ( Code - ' + this.conceptDetail.code + ' )';
        this.conceptWithRelationships = undefined;
        this.sources = this.getSourceList(this.conceptDetail).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        // make sure All is at the front
        if (this.sources[0] != "All" && this.sources.includes("All")) { // make sure All is first in list
          this.sources.splice(this.sources.indexOf("All"), 1);
          this.sources.unshift("All");
        }
        if ((this.activeIndex === 1 || this.activeIndex === 2) &&
          (this.conceptWithRelationships === undefined || this.conceptWithRelationships == null)) {
          this.conceptDetailService.getRelationships(this.conceptCode).subscribe(response => {
            this.conceptWithRelationships = new Concept(response, this.configService);
          });
        }

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

  keepSource(item: string): Boolean {
    return item && item != 'NCIMTH' && item != 'MTH';
  }

  getSourceList(concept) {
    var sourceList = new Set<string>();
    sourceList.add("All");
    for (const obj in concept.synonyms) {
      if (this.keepSource(concept.synonyms[obj].source)) {
        sourceList.add(concept.synonyms[obj].source)
      }
    }
    for (const obj in concept.properties) {
      if (this.keepSource(concept.properties[obj].source)) {
        sourceList.add(concept.properties[obj].source)
      }
    }
    for (const obj in concept.associations) {
      if (this.keepSource(concept.associations[obj].source)) {
        sourceList.add(concept.associations[obj].source)
      }
    }
    for (const obj in concept.inverseAssociations) {
      if (this.keepSource(concept.inverseAssociations[obj].source)) {
        sourceList.add(concept.inverseAssociations[obj].source)
      }
    }

    // If there is no overlap between sourceList and selectedSources, clear selectedSources
    const intersection = [...sourceList].filter(x => this.selectedSources.has(x));
    if (intersection.length == 0) {
      this.toggleSelectedSource('All');
    }

    // Convert set to array and return
    return [...sourceList];
  }


  toggleSelectedSource(source) {
    // clear if All is selected or was last selected
    if (source == "All" || (this.selectedSources.size == 1 && this.selectedSources.has("All"))) {
      this.selectedSources.clear();
    }
    if (this.selectedSources.has(source)) {
      this.selectedSources.delete(source);
      // reset to All if removing last selected source
      if (this.selectedSources.size == 0) {
        this.selectedSources.add("All");
      }
    }
    else {
      this.selectedSources.add(source);
    }
  }
}
