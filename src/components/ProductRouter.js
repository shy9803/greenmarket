import React from 'react';
import { useParams } from 'react-router-dom';
import ItemDetail from './ItemDetail';
import DummyDetail from './DummyDetail';

function ProductRouter() {
  const { id } = useParams();
  const numericId = Number(id);

  if (numericId >= 1000) {
    return <DummyDetail id={numericId} />;
  } else {
    return <ItemDetail id={numericId} />;
  }
}

export default ProductRouter;
