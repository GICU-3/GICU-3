// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const pkg = require(__dirname + '/package.json')
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();




/* * *
  BODY DROP INIT
* * */

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
}
document.body.ondrop = (ev) => {
  ev.preventDefault()
  const file = ev.dataTransfer.files[0].path;
  emitter.emit('document-drop', {file})
}

emitter.on('background-color', (data) => {
  $("body").css({background: data.color})
});

emitter.on('foreground-color', (data) => {
  $("body").css({color: data.color})
});



/* * *
  VUE COMPONENT EXAMPLE
* * */

const store = new Vuex.Store({

  state: {
    count: 1,

    selectedMessageId: 2,
    messages: [
       { id: 1, subject:'Renew Domain', text: '...', inbox: true },
       { id: 2, subject:'New Server Activated', text: '...', inbox: true },
       { id: 3, subject:'Product Generation Complete', text: '...', inbox: false },
       { id: 4, subject:'New Company Deployment', text: '...', inbox: false },
     ]

  },

  getters: {

     selectedMessageId: state => {
       return state.selectedMessageId;
     },

     inboxMessages: state => {
       return state.messages.filter(message => message.inbox)
     },

     inboxMessagesCount: (state, getters) => {
       return getters.inboxMessages.length
     },

     getMessageById: (state, getters) => (id) => {
       return state.messages.find(message => message.id === id)
     }

   },

  mutations: {
    selectMessage (state, id) {
      state.selectedMessageId = id;
    },
    increment (state) {
      state.count++
    }
  },

  actions: {
    incrementAsync ({ commit }) {
      setInterval(() => {
        commit('increment')
      }, 1000)
    }
  }

})

const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}

const app = new Vue({
  el: '#app',

  store,

  components: { Counter },

  template: `
    <div class="app border border-success p-3 m-3">
      Vuex Counter: <counter></counter>
    </div>
  `

})

const appInboxMenu = new Vue({
  el: '#app-inbox-menu',

  store,

  components: { Counter },

  computed: {

     inboxMessage () {
      return this.$store.getters.getTodoById(this.$store.message);
    },
     inboxMessages () {
      return this.$store.getters.inboxMessages
    },
    inboxMessagesCount () {
      return this.$store.getters.inboxMessagesCount
    }
  },

  template: `
  <div>

    <h5><i class="fa fa-inbox fa-1x text-secondary"></i> Inbox <span class="badge badge-danger">{{inboxMessagesCount}}</span></h5>

     <div class="m-3">
       <i class="fa fa-inbox text-secondary"></i> Support Questions <span class="badge badge-secondary">9</span>
     </div>

     <div class="m-3">
       <i class="fa fa-inbox text-secondary"></i> Accounts Receivable <span class="badge badge-secondary">9</span>
     </div>

   </div>
  `

})

const appInbox = new Vue({
  el: '#app-inbox',

  store,

  components: { Counter },

  methods: {
    selectMessage (id) {
      this.$store.commit('selectMessage', id)

    },
    isActive (message) {
      return (message.id === this.$store.getters.selectedMessageId);
    },
  },

  computed: {

    inboxMessage () {
      return this.$store.getters.getTodoById(this.$store.message);
    },
     inboxMessages () {
      return this.$store.getters.inboxMessages
    },
    inboxMessagesCount () {
      return this.$store.getters.inboxMessagesCount
    }
  },

  template: `
    <ul class="list-group mb-3">
      <li v-for="message in inboxMessages" v-bind:class="{ 'list-group-item': true, 'active': isActive(message) } ">
        <span v-on:click="selectMessage(message.id)" >{{ message.subject }}</span>
      </li>
    </ul>
  `

})

store.dispatch({
  type: 'incrementAsync',
  amount: 10
})

var appTitle = new Vue({
  el: '#app-title',
  data: pkg
});




/* * *
  JQUERY EXAMPLE
* * */

$(function(){
  $('title').text(pkg.productName||pkg.name);
});




/* * *
  INTERNAL API EXAMPLE
* * */

emitter.on('document-drop', (data) => {
  alert('Dropped ' + data.file);
});




/* * *
  INTERNAL API EXAMPLE
* * */

$(function(){


  $( "#emitter-example-form" ).submit(function( event ) {
    const eventName = $( "#event-name-select" ).val();
    const color = $( "#example-color-input" ).val();
    console.log((eventName, {color}))
    emitter.emit(eventName, {color})
    event.preventDefault();
  });


});
