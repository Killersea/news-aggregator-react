import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";

interface SwipeableTemporaryDrawerProps {
  opendrawer: boolean;
  setOpendrawer: (value: boolean) => void;
}

export default function SwipeableTemporaryDrawer({
  opendrawer,
  setOpendrawer,
}: SwipeableTemporaryDrawerProps) {
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpendrawer(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{ width: { xs: "40vh", md: "30vh" } }}
      role="drawer"
      onClick={toggleDrawer(false)}
    >
      <List>
        {["Convert File"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={opendrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {DrawerList}
      </SwipeableDrawer>
    </div>
  );
}
