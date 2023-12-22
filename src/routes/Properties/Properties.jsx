import { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom/dist';

import GridLayout from '../../components/GridLayout/GridLayout';

function Properties() {
  const { categoryId } = useParams();

  return <GridLayout id={categoryId} />;
}

export default Properties;
