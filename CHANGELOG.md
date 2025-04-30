# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.1.1.RELEASE] - 2024-04-28
### Changed
- Fixed logic for showing subsetLink to work for manufactured childhood neoplasm subsets

## [2.0.0.RELEASE] - 2024-03-18
### Added
- Adding Executive Order Disclaimer Statement to Home Page.
### Changed
- Ability to scroll through each highlighted concept in the View in Hierarchy display with next/previous buttons
- Change the exports to download as .csv file instead of .xls.
- Reorganized backend build to separate "frontend" from "deployment container"
- Upgraded versions to address vulnerabilities

## [2.0.0.RELEASE] - 2024-01-28
### Added
- Improvements to the "hierarchy" view, including ability to "pop out" that view and better handling of more than 10 tree positions
- Implement views for CDISC subsets
### Changed
- Add vulnerability scanning
- Minor bug fixes to mapping details display and interactions
- Term form improvements and hardening (and ability to open with a code)

## [1.10.0.RELEASE] - 2024-06-15
### Added
- Support for CDISC subsets on subset details page
- Allow user to decline terminology license agreement and redirect them back to welcome page
### Changed
- Version 2.0 of Term Suggestion form
- Updated Help page to include features up to 1.10
- Updated system to Java 17
- Updated Spring Boot to version 2.7.17
### Fixed
- Terminology sources not clearing when different terminology was selected
- Subsets with 0 members not displaying correctly

## [2.0.0.RELEASE] - 2024-01-28
### Added
- Improvements to the "hierarchy" view, including ability to "pop out" that view and better handling of more than 10 tree positions
- Implement views for CDISC subsets

### Changed
- Add vulnerability scanning
- Minor bug fixes to mapping details display and interactions
- Term form improvements and hardening (and ability to open with a code)

## [1.10.0.RELEASE] - 2024-07-29
### Added
- Implement term form (NCIt and CDISC)
- Add ability to decline license agreement

### Changed
- Upgrade Java application that runs the deployment to Spring 3 (and J17)
- Improve help screens for mappings and multiple terminology search
- Minor bug fixes for paging-related issues

## [1.9.0.RELEASE] - 2024-02-01
### Added
- Use concept active flag instead of "Retired_Concept"
- Ability to display terminology in search results
- Initial "multi terminology" search experience
- Implement support for NCIm "source statistics"
### Changed
- Fixed paging/sorting for mapsets
- Fix history to link to replacement concept
- Fixed inactive conepts to show all sections if synonyms are present
- Handle MedDRA license header
- Show map "group / rank" in the mappings table (#241)
- Update to the HHS warning banner (#242)
- Reorder terminologies picklist
- Update google analytics to G4
- Angular 15 Upgrade (and primeng libraries and style fixes)

## [1.8.1.RELEASE] - 2023-10-31
### Added
- Updated index.html for global header

## [1.8.0.RELEASE] - 2023-05-31
### Added
- Feature for browsing/searching/downloading cross-terminology map sets.
- Concept details now shows "history" information  where available
- Deleted concepts for "ncim" are now explicitly represented and searchable by code with links to the corresponding active concepts.
- Additional metadata for remodeled attributes is shown in documentation pages with details of how it is remodeled.
### Changed
- Added support for loading smaller concept payloads and "asking for more info"
- Improved performance of subset loading
- Bug fixes for pagination, bad links, subset loading issues

## [1.7.0.RELEASE] - 2023-01-13
### Added
- Created a Page/Table export service for Search Results and Concept Details.
- Added a link to MedDRA hierarchy from Meta Concept Details page.
- Added user interface to search and display of ChEBI, GO, and HGNC terminologies.
- Provided sortable columns in subset members view.
- Added a table of contents to the concept details page.
- Add Semantic Type(s) to the concept details page for NCIm concepts.
- Added subset code to the subset name in the subset tree.
- Added link to subsets within the concept details of a subset member.
- Added a link to Term Suggestion application from the concept details pages. Prefilled the 'Nearest Code/CUI' field with the concept code of the concept the user selected.
- Added row count to the concept details tables.
- Added highlighting to matching concepts of a subsets search.
### Changed
- Updated to open new tabs whenever a link is selected by a user outside of the application. 
- Updated application URL to evsexplore.semantics.cancer.gov from evsexplore.nci.nih.gov.
- Removed tabs from the concept details page and consolidated all information into one concept details page.
- Extended the subset search to support searching by subset code.
- Showing synonym qualifiers and definition qualifiers in concept details.
- Set limits for results in concept details and hierarchy functionality, with the ability for the user to request all results. 

## [1.6.0.RELEASE] - 2022-05-24
### No change log for earlier releases
