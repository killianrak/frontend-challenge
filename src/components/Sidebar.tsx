// Sidebar.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  GroupsOutlined as GroupsIcon,
  SupportAgent as SupportIcon,
  FolderCopy,
  SmsOutlined as SmsIcon,
  Star as StarIcon,
  HelpOutline as HelpIcon,
  AccountCircleOutlined as AccountIcon,
  LogoutRounded as LogoutIcon,
  GridView,
  InsertDriveFileOutlined,
  InfoOutlineRounded
} from '@mui/icons-material';


// Composant icône Google
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);



export const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState('Ma Campagne');

  const menuItems = [
    {
      section: 'Tous les stratégies',
      items: [
        { label: 'Mon tableau de bord', icon: <GridView />, active: false },
        { label: 'Ma Campagne', icon: <FolderCopy />, active: true },
        { label: 'Récapitulatif des Utilisateurs', icon: <GroupsIcon />, active: false },
        { label: 'Supports de diffusion', icon: <InsertDriveFileOutlined />, active: false },
        { label: 'Campagnes SMS', icon: <SmsIcon />, active: false },
        { label: 'Gestion des Avis Google', icon: <GoogleIcon />, active: false },
        { label: 'Mon Centre d\'aide', icon: <InfoOutlineRounded />, active: false }
      ]
    }
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        bgcolor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2, textAlign: 'left', borderBottom: '1px solid #f3f4f6' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#6366f1',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            🎁
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px', color: '#111827' }}>
            THE GIFT CLUB
          </Typography>
        </Box>
      </Box>

      {/* Menu Navigation */}
      <Box sx={{ flex: 1, py: 2, overflow: 'auto' }}>
        {menuItems.map((section) => (
          <Box key={section.section} sx={{ mb: 2 }}>
            <List dense sx={{ mt: 1, px: 2 }}>
              {section.items.map((item) => (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={item.active}
                    onClick={() => setSelectedItem(item.label)}
                    sx={{
                      borderRadius: 1,
                      py: 1,
                      px: 2,
                      color: item.active ? '#1a55d4ff' : '#6b7280',
                      bgcolor: item.active ? 'rgba(59, 131, 246, 0.51)' : 'transparent',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(72, 131, 228, 0.35)',
                        color: '#1a55d4ff',
                        '& .MuiListItemIcon-root': {
                          color: '#1a55d4ff',
                        }
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        '& .MuiSvgIcon-root': {
                          fontSize: 20
                        }
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: item.active ? 500 : 400,
                        lineHeight: 1.2
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}

        {/* Carte promotionnelle */}
        <Box sx={{ px: 2, mt: 4 }}>
          <Card sx={{
            bgcolor: 'rgba(26, 85, 212, 0.08)',
            border: '1px solid #1a55d4ff',
            boxShadow: 'none'
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textAlign: 'center',
                  color: '#1f2937',
                  fontSize: '13px'
                }}
              >
                Commandez vos Flyers Personnalisés
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 1.5,
                    bgcolor: '#f1f5f9',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <Box sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#3b82f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    🎨
                  </Box>
                </Avatar>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#6b7280',
                  textAlign: 'center',
                  display: 'block',
                  mb: 2,
                  lineHeight: 1.4,
                  fontSize: '11px'
                }}
              >
                Commandez et personnalisez vos PLV pour booster l'engagement client. Créez des supports à votre image pour maximiser vos conversions.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  bgcolor: '#1a55d4ff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '12px',
                  py: 1,
                  '&:hover': {
                    bgcolor: '#2563eb'
                  }
                }}
              >
                COMMANDEZ
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Footer avec compte utilisateur dans la zone scrollable */}
        <Box sx={{ px: 2, mt: 4, borderTop: '1px solid #f3f4f6', pt: 2 }}>
          <ListItemButton
            sx={{
              borderRadius: 1,
              py: 1,
              px: 2,
              mb: 0.5,
              color: '#6b7280',
              '&:hover': {
                bgcolor: '#f9fafb'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AccountIcon sx={{ color: '#6b7280', fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Compte"
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#6b7280'
              }}
            />
          </ListItemButton>
          <ListItemButton
            sx={{
              borderRadius: 1,
              py: 1,
              px: 2,
              color: '#6b7280',
              '&:hover': {
                bgcolor: '#f9fafb'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon sx={{ color: '#6b7280', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Déconnexion"
              primaryTypographyProps={{
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#6b7280'
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
};