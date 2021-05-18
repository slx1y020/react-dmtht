import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Breadcrumb} from 'antd';
import BreadcrumbNameMap from './breadcrumbNameMap';

const Bread = withRouter((props) => {
  //location 为浏览器默认的api
  const { location } = props;
  const breadcrumbNameMap = BreadcrumbNameMap;
  const url = location.pathname
  let isIndex = false;
  if ( url === '/') {
    isIndex = true;
  }
  const nameItem = breadcrumbNameMap[url]
  const breadcrumbItems = [
    <Breadcrumb.Item key={url}>
        <Link to={url} >
            {nameItem}
        </Link>
    </Breadcrumb.Item>
  ]

  return (
        isIndex ? null : <Breadcrumb>{breadcrumbItems}</Breadcrumb>
  );
});

export default Bread;