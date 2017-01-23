import React from 'react';
import ReactDOM from 'react-dom';

// 引入React-Router模块
import { Router, Route, hashHistory, IndexRoute } from 'react-router';


// 引入单个页面（包括嵌套的子页面）
import myTable from './components/table.js'

ReactDOM.render((
    <Router history={hashHistory} >
        <Route path="/" component={myTable}>
            <IndexRoute path="myTable" component={myTable} />
            <Route path="myTable" component={myTable} />
        </Route>
    </Router>
), document.getElementById('app'));
