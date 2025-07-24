import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material';

interface HeaderProps {
  onPinClick: () => void;
  onQrClick: () => void;
  onSave: () => void;
  isPinConfigured?: boolean;
  pinCode?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onPinClick, 
  onQrClick, 
  onSave, 
  isPinConfigured = false,
  pinCode = ""
}) => {
  return (
    <Card sx={{
      mr: 0,
      backgroundColor: '#f5f5f5',
      boxShadow: 'none',
      border: 'none',
      borderRadius: 0,
      borderBottom: '1px solid #e5e7eb'
    }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: '#1a55d4ff', fontWeight: 'bold' }}>
              Ma Campagne
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={onPinClick}
                size="small"
                sx={{
                  border: '1px solid #E0E0E0',
                  color: '#000',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '7px',
                    backgroundColor: isPinConfigured ? '#4CAF50' : '#450e4fff',
                    zIndex: 1,
                  },
                  '&:hover': {
                    border: '1px solid #BDBDBD',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {isPinConfigured ? `PIN: ${pinCode}` : 'Mon Code PIN'}
              </Button>
              <Button
                variant="contained"
                startIcon={<QrCodeIcon />}
                onClick={onQrClick}
                sx={{
                  backgroundColor: '#FF8F00',
                  borderRadius: '4px',
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#FFC107',
                    boxShadow: 'none'
                  }
                }}
              >
                QR Code
              </Button>
              <Button
                variant="contained"
                onClick={onSave}
                sx={{
                  bgcolor: '#1a55d4ff',
                  borderRadius: '4px',
                  '&:hover': { bgcolor: '#3367d6' }
                }}
              >
                SAUVEGARDER
              </Button>
              <Button
                variant="text"
                sx={{
                  backgroundColor: 'rgba(26, 85, 212, 0.04)',
                  color: '#1a55d4ff',
                  minWidth: 'auto',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 85, 212, 0.08)'
                  }
                }}
              >
                <MoreHorizIcon />
              </Button>
            </Box>
          </Box>
          {/* Date déplacée en bas à droite */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                borderRight: '8px solid #1a55d4ff',
                paddingRight: '12px'
              }}
            >
              Disponible jusqu'au 15 déc. 2025
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};