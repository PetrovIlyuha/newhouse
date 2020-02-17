import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Typography } from 'antd';

import madridImage from '../../assets/madrid.jpg';
import jaffaImage from '../../assets/jaffa.jpg';
import shanghaiImage from '../../assets/shanghai.jpg';
import viennaImage from '../../assets/vienna.jpg';

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}
export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">
          Find a place where you'll feel like new home
        </Title>
        <Search
          placeholder="Search 'Moscow'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        ></Search>
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/madrid">
            <Card cover={<img src={madridImage} alt="madrid" />}>Madrid</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/jaffa">
            <Card cover={<img src={jaffaImage} alt="jaffa" />}>Jaffa</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/shanghai">
            <Card cover={<img src={shanghaiImage} alt="shanghai" />}>
              Shanghai
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/vienna">
            <Card cover={<img src={viennaImage} alt="vienna" />}>Vienna</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
