import { useEffect, useState } from "react";
import { Media } from "../../store/productManagement/product/types";
import Box from "@material-ui/core/Box";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import filter from "lodash/filter";
const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
      marginBottom: 8,
    },
    gridList: {
      flexWrap: "nowrap",
      transform: "translateZ(0)",
    },
    title: {
      color: "#fff",
      fontSize: 12,
    },
    redIcon: {
      color: "#dd4b39",
    },
    titleBar: {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    },
  })
);

interface RepnotesMediaPreviewProps {
  mediaList: Array<Media>;
  disabled?: boolean;
  type: "image" | "video" | "pdf";
  onDeleteClick: (type: string, path: string) => void;
  propertyKey?: string;
}

const RepnotesMediaPreview = (props: RepnotesMediaPreviewProps) => {
  const [localMedia, setMedia] = useState<Array<Media>>([]);
  const { mediaList, disabled, type, onDeleteClick, propertyKey } = props;
  const classes = useStyles();

  // local file loader
  const synchronousImageLoader = async (file: File) => {
    let r64 = await new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });

    return r64;
  };

  // initialize local preview
  useEffect(() => {
    const load = async () => {
      try {
        let media = filter(mediaList, (m) => typeof m !== "undefined");
        for (const i in media) {
          if (
            typeof media[i].file !== "undefined" &&
            typeof media[i].file!.name !== "undefined"
          ) {
            // convert file to path and type
            media[i] = {
              ...media[i],
              file: media[i].file,
              type: media[i].file!.type,
              path: (await synchronousImageLoader(media[i].file!)) as string,
            };
          }
        }
        setMedia(media);
      } catch (e) {
        console.log(e);
      }
    };
    load(); // load media
    // eslint-disable-next-line
  }, [mediaList]);

  return (
    <Box className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {localMedia.map((media: Media) => (
          <GridListTile
            style={{ height: 120, width: 120 }}
            key={media.name as string}
          >
            {media.type && media.type.toLowerCase().indexOf("image") > -1 && (
              <img src={media.path as string} alt={media.path as string} />
            )}
            {media.type && media.type.toLowerCase().indexOf("video") > -1 && (
              <video controls>
                <source src={media.path as string}></source>
              </video>
            )}
            {media.type && media.type.toLowerCase().indexOf("pdf") > -1 && (
              <img
                src={`${API_URL}media/uploads/brochure/pdf.png`}
                alt={media.path as string}
              />
            )}
            <GridListTileBar
              title={media.name}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                !disabled && (
                  <IconButton
                    aria-label={`delete ${media.name}`}
                    onClick={() => {
                      if (propertyKey) {
                        onDeleteClick(propertyKey, media.name as string);
                      } else {
                        onDeleteClick(type as string, media.name as string);
                      }
                    }}
                  >
                    <DeleteIcon className={classes.redIcon} />
                  </IconButton>
                )
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </Box>
  );
};

export default RepnotesMediaPreview;
