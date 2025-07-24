
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface AlertsSectionProps {
  isPinConfigured: boolean;
  onConfigurePin: () => void;
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  isPinConfigured,
  onConfigurePin
}) => {
  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      backgroundColor: '#FFF3C4',
      border: '1px solid #F59E0B'
    }}>
      <CardContent sx={{ p: 4 }}> 
        {!isPinConfigured && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 3 
          }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{
                width: 56, 
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#ffffff', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' 
              }}>
                <LockIcon sx={{ color: '#F59E0B', fontSize: 28 }} /> 
              </Box>
              
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: '#000000', 
                    mb: 0.5
                  }}
                >
                  Votre Code PIN n'est pas configuré
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: '#000000' }} 
                >
                  Activez-le pour sécuriser la récupération des cadeaux par vos clients.
                </Typography>
              </Box>
            </Box>


            <Button
              variant="contained"
              onClick={onConfigurePin}
              sx={{
                backgroundColor: '#F59E0B', 
                color: '#000000',
                fontWeight: 'bold',
                px: 4,
                py: 1.5, 
                borderRadius: 2,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)', 
                '&:hover': {
                  backgroundColor: '#D97706', 
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)' 
                }
              }}
            >
              CONFIGURER MON CODE
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};