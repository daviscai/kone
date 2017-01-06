import React, { Component }  from 'react';

class Article extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="article">
        <h2 className="article-title">
            Hi react
        </h2>
      </article>
    );
  }
}
export default Article;
