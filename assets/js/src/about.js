import React from 'react';
import ReactDOM from 'react-dom';

// 引入React-Router模块
import { Router, Route, hashHistory, IndexRoute } from 'react-router';


// 引入单个页面（包括嵌套的子页面）
import myTable from './components/table.js'
import myForm from './components/form.js'
import myCalendar from './components/calendar.js'
import myCard from './components/fetch.js'

ReactDOM.render((
    <Router history={hashHistory} >
        <Route path="/" component={myTable}>
            <IndexRoute path="myCard" component={myCard} />
            <Route path="myTable" component={myTable} />
            <Route path="myForm" component={myForm} />
            <Route path="myCalendar" component={myCalendar} />
            <Route path="myCard" component={myCard} />
        </Route>
    </Router>
), document.getElementById('app'));
