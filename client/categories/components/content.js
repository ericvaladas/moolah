import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as categoriesActionCreators from '../../state/categories/action-creators';
import Subheader from './subheader';
import CategoriesList from './categories-list';
import EmptyCategories from './empty-categories';
import ErrorRetrieving from '../../common/components/error-retrieving';
import LoadingResourceList from '../../common/components/loading-resource-list';

export class Content extends Component {
  render() {
    let contents;
    const {
      retrievingCategoriesStatus, categories, retrieveCategories
    } = this.props;

    if (retrievingCategoriesStatus === 'PENDING') {
      contents = <LoadingResourceList/>;
    } else if (retrievingCategoriesStatus === 'FAILURE') {
      contents = (<ErrorRetrieving
        retry={retrieveCategories}
        resourceName="Categories"/>);
    } else if (!categories.length) {
      contents = <EmptyCategories/>;
    } else {
      contents = <CategoriesList/>;
    }

    return (
      <div className="container-bottomSpaced">
        <Subheader/>
        {contents}
      </div>
    );
  }

  componentDidMount = () => {
    const {retrieveCategories} = this.props;
    this.fetchingCategoriesXhr = retrieveCategories();
  }

  componentWillUnmount = () => {
    if (this.fetchingCategoriesXhr) {
      this.fetchingCategoriesXhr.abort();
    }
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categories.resources,
    retrievingCategoriesStatus: state.categories.retrievingCategoriesStatus
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    retrieveCategories: categoriesActionCreators.retrieveCategories
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
