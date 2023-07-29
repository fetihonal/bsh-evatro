import React, { Children, useContext, useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'

const { Header, Sider, Content } = Layout

import MenuItem from '../components/Menu/MenuItem'
import { Home, Trade } from 'iconsax-react'

const HomePage = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const isLinkActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={115}
        collapsedWidth={115}
        className='p-3'
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className='demo-logo-vertical' />
        <MenuItem
          to='/'
          icon={<Home />}
          title='Ana Sayfa'
          active={isLinkActive('/')}
        />
        <MenuItem
          to='/test'
          icon={<Trade />}
          title='Trade'
          active={isLinkActive('/test')}
        />
        <MenuItem
          to='/'
          icon={<Home />}
          title='Ana Sayfa'
          active={isLinkActive('/a')}
        />
        <MenuItem
          to='/test'
          icon={<Trade />}
          title='Trade'
          active={isLinkActive('/tesst')}
        />
        <MenuItem
          to='/'
          icon={<Home />}
          title='Ana Sayfa'
          active={isLinkActive('/we')}
        />
        <MenuItem
          to='/test'
          icon={<Trade />}
          title='Trade'
          active={isLinkActive('/qwe')}
        />
        <MenuItem
          to='/'
          icon={<Home />}
          title='Ana Sayfa'
          active={isLinkActive('/qwe')}
        />
        <MenuItem
          to='/test'
          icon={<Trade />}
          title='Trade'
          active={isLinkActive('/rrr')}
        />
      </Sider>
      <Layout className='site-layout' style={{ marginLeft: 115 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default HomePage
