function App() {

  var page;
  this.setPage = function(p) { page = p; }
  this.getPage = function()  { return page;}

}

App.prototype = {
  constructor : App
}