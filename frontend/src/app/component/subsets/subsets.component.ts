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
  originalHierarchy: TreeNode[];
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

    if (this.configService.subsets === undefined || this.configService.subsets === null) {
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
        this.originalHierarchy = JSON.parse(JSON.stringify(this.configService.subsets));
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
    // if an element has children, search the children
    if (tn.children) {
      tn.children.forEach((element) => {
        const newChild = this.performSubsetSearchHelper(element, string);
        if (newChild) {
          newChildren.push(newChild);
        }
      });
    }
    // if an element has children that match OR its name/code DOES NOT include the search string
    if (
      newChildren.length !== 0 ||
      !tn.name.toLowerCase().includes(string.toLowerCase()) ||
      !tn.code.toLowerCase().includes(string.toLowerCase())
    ) {
      tn.children = newChildren;
      tn.expanded = true;
    }
    // send the element back if it has children OR if it includes the search string (base case)
    return tn.name.toLowerCase().includes(string.toLowerCase()) ||
      tn.code.toLowerCase().includes(string.toLowerCase()) ||
      tn.children.length > 0 
      ? tn
      : null;
  }

  findInTree(tn, tree) {
    const indices = new Array();
    for (var i = 0; i < tree.length; i++) {
      //check the children regularly
      if (tree[i].data.code == tn.data.code) {
        indices.push(i);
      }

      if (tree[i].children?.length > 0) {
        var childId = this.findInTree(tn, tree[i].children);
        if (childId?.length > 0) {
          childId.forEach(element => {
            indices.push(element);
          });
          indices.push(i);
        }
      }
    }
    return indices.length > 0 ? indices : null;
  }

  moreChildren(tn) {
    if (this.subsetSearchText) {
      // const originalHierarchy = JSON.parse(JSON.stringify(this.configService.subsets));
      
      var index = this.findInTree(tn.node, this.originalHierarchy);

      //while index has unused indices, continue down tree with said indices
      var originalNode = this.originalHierarchy[index[index.length-1]];

      //get the original node for comparison
      if (index.length > 1 && originalNode?.children.length > 0) {
        for (var i = index.length-2; i >= 0; i--) {
          originalNode = originalNode?.children[index[i]];
        }
      }
      // if (originalNode?.children?.length - tn.node.children.length == originalNode?.children?.length) {
      //   tn.node.expanded = false;
      // }
      
      //compare
      return originalNode?.children?.length - tn.node.children.length;
    }
    return false
  }

  revealMore(tn, type) {
    this.loaderService.showLoader();
    if (type == "children") {
      //locate the current node, replace with node from previous hierarchy
      if (tn.node.children) {
        // const originalHierarchy = JSON.parse(JSON.stringify(this.configService.subsets));

        //find tn in current tree -- get index;
        var currId = this.findInTree(tn.node, this.hierarchyData);

        //find tn in original tree
        var origId = this.findInTree(tn.node, this.originalHierarchy);

        // replace data in hierarchy data at current tree with original tree
        //get the original node for comparison
        var originalNode = this.originalHierarchy[origId[origId.length-1]];
        if (origId.length > 1 && originalNode?.children.length > 0) {
          for (var i = origId.length-2; i >= 0; i--) {
            originalNode = originalNode?.children[origId[i]];
          }
        }

        //get current open nodes
        const openNodes = new Array();
        this.hierarchyData.forEach(child => {
          if (child.expanded && child.children?.length > 0) {
            openNodes.push(child.data?.code, child.children);
          }
          child.children?.forEach(child2 => {
            if (child2.expanded && child2.children?.length > 0) {
              openNodes.push(child2.data?.code, child2.children);
            }
            child2.children?.forEach(child3 => {
              if (child3.expanded && child3.children?.length > 0) {
                openNodes.push(child3.data?.code, child3.children);
              }
              child3.children?.forEach(child4 => {
                if (child4.expanded && child4.children?.length > 0) {
                  openNodes.push(child4.data?.code, child4.children)
                }
              });
            });
          });
        });

        //replacement (leave open nodes)
        originalNode.children?.forEach(child => {
          if (openNodes.includes(child.data?.code) && tn.node.data.code != child.data.code) {
            child.children = openNodes[openNodes.indexOf(child.data?.code)+1];
            child.expanded = true;
          }
          child.children?.forEach(child2 => {
            if (openNodes.includes(child2.data?.code)) {
              child2.children = openNodes[openNodes.indexOf(child2.data?.code)+1];
              child2.expanded = true;
            }
            child2.children?.forEach(child3 => {
              if (openNodes.includes(child3.data?.code)) {
                child3.children = openNodes[openNodes.indexOf(child3.data?.code)+1];
                child3.expanded = true;
              }
              child3.children?.forEach(child4 => {
                if (child4.expanded && child4.children?.length > 0) {
                  child4.children = openNodes[openNodes.indexOf(child4.data?.code)+1];
                  child4.expanded = true;
                }
              });
            });
          })
        });

        //replacement - max is 3 levels down
        if (origId.length == 3) {
          this.filteredHierarchy[currId[2]].children[currId[1]].children[currId[0]] = originalNode;
          this.filteredHierarchy[currId[2]].children[currId[1]].children[currId[0]].expanded = true;
        }
        else if (origId.length == 2) {
          this.filteredHierarchy[currId[1]].children[currId[0]] = originalNode;
          this.filteredHierarchy[currId[1]].children[currId[0]].expanded = true;
        }
        else if (origId.length == 1) {
          this.filteredHierarchy[currId[0]] = originalNode;
          this.filteredHierarchy[currId[0]].expanded = true;
        }
      }
    }
    setTimeout(() => {
      this.hierarchyData = this.filteredHierarchy;
      this.sortNcitFirst();
      this.loaderService.hideLoader();
    }, 10);
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
