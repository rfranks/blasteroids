window.Searcher = (function() {
    function Searcher() {
        this._index = lunr(function () {
            this.field('title', {boost: 10})
            this.field('body')
            this.ref('id')
          }) ;

        this._indexContent = undefined;
    }

    Searcher.prototype.init = function() {
        var self = this;

        $("script[type='text/x-docstrap-searchdb']").each(function(idx, item)  {
            self._indexContent = JSON.parse(item.innerHTML);

            for (var entryId in self._indexContent) {
                self._index.add(self._indexContent[entryId]);
            }
        });
    };

    Searcher.prototype.search = function(searchTerm) {
        var results = [],
                searchResults = this._index.search(searchTerm);

        for (var idx = 0; idx < searchResults.length; idx++) {
            results.push(this._indexContent[searchResults[idx].ref])
        }

        return results;
    };

    return new Searcher();
})();

window.SearcherDisplay = (function($) {
    /**
     * This class provides support for displaying quick search text results to users.
     */
    function SearcherDisplay() { }

    SearcherDisplay.prototype.init = function() {
        this._displayQuickSearch();
    };

    /**
     * This method creates the quick text search entry in navigation menu and wires all required events.
     */
    SearcherDisplay.prototype._displayQuickSearch = function() {
            var quickSearch = $(document.createElement("iframe")),
                   body = $("body"),
                   self = this;

            quickSearch.attr("src", "quicksearch.html");
            quickSearch.css("width", "0px");
            quickSearch.css("height", "0px");

            body.append(quickSearch);

            $(window).on("message", function(msg) {
                var msgData = msg.originalEvent.data;

                if (msgData.msgid != "docstrap.quicksearch.done") {
                    return;
                }

                var results = msgData.results || [];

                self._displaySearchResults(results);
            });

            function startSearch() {
              var searchTerms = $('#search-input').prop("value");
              if (searchTerms) {
                quickSearch[0].contentWindow.postMessage({
                  "searchTerms": searchTerms,
                  "msgid": "docstrap.quicksearch.start"
                }, "*");
              }
            }

            $('#search-input').on('keyup', function(evt) {
              if (evt.keyCode != 13) {
                return;
              }
              startSearch();
              return false;
            });
            $('#search-submit').on('click', function() {
              startSearch();
              return false;
            });
    };

    /**
     * This method displays the quick text search results in a modal dialog.
     */
    SearcherDisplay.prototype._displaySearchResults = function(results) {
            var resultsHolder = $($("#searchResults").find(".modal-body")),
                  fragment = document.createDocumentFragment(),
                  resultsList = document.createElement("ul");

            resultsHolder.empty();

            for (var idx = 0; idx < results.length; idx++) {
                var result = results[idx],
                       item = document.createElement("li"),
                       link = document.createElement("a");

                link.href = result.id;
                link.innerHTML = result.title;

                item.appendChild(link)
                resultsList.appendChild(item);
            }

            fragment.appendChild(resultsList);
            resultsHolder.append(fragment);

            $("#searchResults").modal({"show": true});
    };

    return new SearcherDisplay();
})($);
