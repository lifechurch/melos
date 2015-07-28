angular.module("reader.bookList", [])

.directive("readerBookList", function() {
	return {
		restrict: 'A',
		scope: {
			books: '=',
			booksPerColumn: '=',
			maxColumns: '=',
			displayMode: '=', //traditional or alphabetic/
			filter: '=',
			sort: '=',
			version: '=',
			selectedBook: '=',
			onBookSelected: '='
		},
		controller: ["$scope", function($scope) {
			var booksPerColumn;
			if (!$scope.booksPerColumn) { $scope.booksPerColumn = 16; }	
			if (!$scope.maxColumns) { $scope.maxColumns = 4; }
			if (!$scope.displayMode) { $scope.displayMode = "alphabetic"; }

			$scope.filterBook = function(filter, book) {
				return typeof(filter) === 'undefined' || filter === null || filter == "" || book.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			};

			$scope.showChapters = function(book) {
				$scope.selectedBook = book;
				if ($scope.onBookSelected && typeof $scope.onBookSelected === 'function') {
					$scope.onBookSelected(book);
				}
			};

			$scope.$watchGroup(["books", "sort"], function(oldVal, newVal) {
				if (oldVal != newVal) {
					var books = angular.copy($scope.books);
					if (books.length / $scope.booksPerColumn > $scope.maxColumns) {
						booksPerColumn = Math.ceil(books.length / $scope.maxColumns);
					} else {
						booksPerColumn = $scope.booksPerColumn;
					}

					if ($scope.sort) {
						books.sort(function(a, b) {
							return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
						});
					}

					$scope.columns = [];
					var currentColumnIndex = 0;
					var currentColumnCount = 0;
					var lastCanon;
					var firstIterationForCanon = !$scope.sort;
					for(var i = 0; i < books.length; i++) {
						if (lastCanon && (lastCanon != books[i].canon) && !$scope.sort) {
							currentColumnIndex++;
							currentColumnCount = 0;
							firstIterationForCanon = true;
						}

						if (!$scope.columns[currentColumnIndex]) {
							$scope.columns[currentColumnIndex] = [];
						}

						if (firstIterationForCanon) {
							currentColumnCount++;
							var name = (books[i].canon == 'ot') ? "Old Testament" : "New Testament";
							$scope.columns[currentColumnIndex].push({name: name, labelOnly: true});	
						}

						currentColumnCount++;
						$scope.columns[currentColumnIndex].push(books[i]);

						if (currentColumnCount == booksPerColumn) {
							currentColumnIndex++;
							currentColumnCount = 0;
						}

						lastCanon = books[i].canon;
						firstIterationForCanon = false;
					}

					$scope.foundationColumnSize = "text-left columns medium-" + (Math.floor(12 / $scope.columns.length)).toString();
				}
			});	
		}],
		templateUrl: '/reader-book-selector.tpl.html'
	};	
})

;