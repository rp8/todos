
var TodoApp = {};

(function() {
TodoApp.Models = (function(){

	// generate four random hex digits.
	function S4() {
		 return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};

	// generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
		 return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};

  var Todo = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "?",
        order: TodoApp.Todos.nextOrder(),
        done: false
      };
    },

    initialize: function() {
			if (!this.get('id'))
				this.set({'id': guid()});
      if (!this.get("title")) {
        this.set({"title": this.defaults().title});
      }
    },

		url: function() {
			return '/todos/' + this.get('id');
		},

    toggle: function() {
      this.save({done: !this.get("done")});
    },

    clear: function() {
      this.destroy();
    }

  });

  var TodoList = Backbone.Collection.extend({

    model: Todo,
		
		url: function() {
			return '/todos';
		},

    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    remaining: function() {
      return this.without.apply(this, this.done());
    },

    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    comparator: function(todo) {
      return todo.get('order');
    }

  });

	var Todos = new TodoList;

	return {
		Todo: Todo,
		TodoList: TodoList
	};
})();

TodoApp.Todos = (function(){ return new TodoApp.Models.TodoList; })();
})();

