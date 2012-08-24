(function() {
TodoApp.Views = (function(){
  var AppView = Backbone.View.extend({

		el: $("#todoapp"),

		events: {
			"keypress #new-todo":  "createOnEnter",
			"click #new-todo":  "focus1",
			"touchstart input":  "focus2",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

    initialize: function() {
      this.main = this.$('#main');
      this.newtodo = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];
      this.todolist = this.$('#todo-list');
      this.status = this.$('#status');

			TodoApp.Todos.on('add', this.addOne, this);
			TodoApp.Todos.on('reset', this.addAll, this);
			TodoApp.Todos.on('all', this.render, this);

			TodoApp.Todos.fetch();
		},

    refresh: function(callback) {
      this.todolist.empty();
      TodoApp.Todos.fetch(
        {
          success: function(model, res) {
            callback.call();
          }
        }
      );
    },

		render: function() {
			var done = TodoApp.Todos.done().length;
			var remaining = TodoApp.Todos.remaining().length;

			var that = this;
			dust.render('stats.dust', {done: done, remaining: remaining}, function(err, out) {
				that.main.show();
				that.status.show();
				that.status.html(out);
			});

			this.allCheckbox.checked = !remaining;
		},

		addOne: function(todo) {
			var view = new TodoView({model: todo});
			this.$('#todo-list').append(view.render().el);
		},

		addAll: function() {
			TodoApp.Todos.each(this.addOne);
		},

    focus1: function(e) {this.newtodo.focus();},
    focus2: function(e) {e.stopPropagation();},

		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.newtodo.val()) return;

			TodoApp.Todos.create({title: this.newtodo.val()});
			this.newtodo.val('');
		},

		clearCompleted: function() {
			_.each(TodoApp.Todos.done(), function(todo){ todo.clear(); });
			return false;
		},

		toggleAllComplete: function () {
			var done = this.allCheckbox.checked;
			TodoApp.Todos.each(function (todo) { todo.save({'done': done}); });
		}

	});

  var TodoView = Backbone.View.extend({

    tagName:  "li",

    events: {
      "click .toggle"   : "toggleDone",
      "click a.change"    : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    render: function() {
		  var that = this;
			dust.render('item.dust', this.model.toJSON(), function(err, out) {
				that.$el.html(out);
				that.$el.toggleClass('done', that.model.get('done'));
				that.newtodo = that.$('.edit');
			});
      return this;
    },

    toggleDone: function() {
      this.model.toggle();
    },

    edit: function() {
      this.$el.addClass("editing");
      this.newtodo.focus();
    },

    close: function() {
      var value = this.newtodo.val();
      if (!value) this.clear();
      this.model.save({title: value});
      this.$el.removeClass("editing");
    },

    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    clear: function() {
      this.model.clear();
    }

  });

	return {
		AppView: AppView,
		TodoView: TodoView
  };

})();

App = new TodoApp.Views.AppView;
})();
