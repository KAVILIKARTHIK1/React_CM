import React, { useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Divider } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../SidebarMenu.css';  // Import the CSS file
import hexLogo from '../Images/hexLogo.png'
export default function SidebarMenu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Members', path: '/members' },
    { text: 'Assessments', path: '/assessments' },
    { text: 'ADT Events', path: '/adt-events' },
    { text: 'Users', path: '/users' },
    {text: 'Admin', path:'/admin'}
  ];

  return (
    <div>
      {/* AppBar with Hamburger Menu */}
      <AppBar sx={{backgroundColor: '#231e49'}} position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Care Management
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div style={{  backgroundColor: '#231e49'}}>
          <img src={hexLogo} alt="hexNew.png" />
          </div>
        <div
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          style={{ width: 250 }}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.path}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </div>
      </Drawer>

      {/* Content Section */}
      <main style={{ marginTop: 64, padding: '20px' }}>
        {/* Place your page content here */}
      </main>
    </div>
  );
}
