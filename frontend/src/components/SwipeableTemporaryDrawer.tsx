import { Box, List, ListItem, Divider } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FileUploadConvert from "./FileUploadConvert";

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
    <Box sx={{ width: { xs: "40vh", md: "30vh" } }} role="drawer">
      <List>
        <ListItem>
          <FileUploadConvert />
        </ListItem>
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
