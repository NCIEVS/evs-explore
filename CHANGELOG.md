# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
