$(function() {
TodoApp.Views = (function(){
  var AppView = Backbone.View.extend({

		el: $("#todoapp"),

		events: {
			"keypress #new-todo":  "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		initialize: function() {

			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];

			TodoApp.Todos.on('add', this.addOne, this);
			TodoApp.Todos.on('reset', this.addAll, this);
			TodoApp.Todos.on('all', this.render, this);

			this.footer = this.$('footer');
			this.main = $('#main');

			TodoApp.Todos.fetch();
		},

		render: function() {
			var done = TodoApp.Todos.done().length;
			var remaining = TodoApp.Todos.remaining().length;

			if (TodoApp.Todos.length) {
				var that = this;
				dust.render('stats.dust', {done: done, remaining: remaining}, function(err, out) {
					that.main.show();
					that.footer.show();
					that.footer.html(out);
				});
			} else {
				this.main.hide();
				this.footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		addOne: function(todo) {
			var view = new TodoView({model: todo});
			this.$("#todo-list").append(view.render().el);
		},

		addAll: function() {
			TodoApp.Todos.each(this.addOne);
		},

		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;

			TodoApp.Todos.create({title: this.input.val()});
			this.input.val('');
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
      "dblclick .view"  : "edit",
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
				that.input = that.$('.edit');
			});
      return this;
    },

    toggleDone: function() {
      this.model.toggle();
    },

    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    close: function() {
      var value = this.input.val();
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

var App = new TodoApp.Views.AppView;
});
