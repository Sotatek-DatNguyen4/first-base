import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DefaultLayout from '../../components/layout/default-layout';
import { testApi } from '../../store/actions/testApi';
import './style.scss';

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(testApi());
  }, [dispatch]);

  return (
    <DefaultLayout>
      <div className="home-page">Home page</div>
    </DefaultLayout>
  );
};

export default Home;
