import { Box, Grid, LinearProgress, Avatar, Chip, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import NestedModal from "./MessageModal";
import { useSnackbar } from "notistack";

function renderStatus(status) {
  const colors = {
    online: {
      color: "success",
      text: "Online",
    },
    offline: {
      color: "warning",
      text: "Offline",
    },
    blocked: {
      color: "warning",
      text: "Blok",
    },
    waitEmail: {
      color: "warning",
      text: "Email Onay",
    },
    deleted: {
      color: "error",
      text: "Sil",
    },
  };

  return (
    <Chip
      label={colors[status].text}
      color={colors[status].color}
      size="small"
    />
  );
}

function renderType(status) {
  const colors = {
    personal: {
      color: "info",
      text: "Kişisel",
    },
    service: {
      color: "warning",
      text: "Servis",
    },
  };

  return (
    <Chip
      label={colors[status].text}
      color={colors[status].color}
      size="small"
    />
  );
}

function renderAvatar(params) {
  return (
    <Avatar
      sx={{
        width: "24px",
        height: "24px",
        fontSize: "0.85rem",
      }}
      alt={params.name}
      src={params.image}
      sizes="small"
    />
  );
}

const Errors = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isLoad, setLoad] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "user",
      headerName: "Rapor Eden",
      flex: 1,
      valueGetter: (value, row) => {
        return `${
          row.type === "personal"
            ? row.personalUserId.name + " " + row.personalUserId.surname
            : row.serviceUserId.firm.name
        }`;
      },
    },
    {
      field: "reportUser",
      headerName: "Rapor Edilen",
      flex: 1,
      valueGetter: (value, row) => {
        return `${
          row.type === "personal"
            ? row.serviceUserId.firm.name
            : row.personalUserId.name + " " + row.personalUserId.surname
        }`;
      },
    },
    {
      field: "reason",
      headerName: "Sebebi",
      flex: 1,
      minWidth: 40,
    },

    {
      field: "createDate",
      headerName: "Raporlama Tarihi",
      flex: 1,
      type: "dateTime",
      valueGetter: (params, row) => {
        return new Date(params);
      },
      renderCell: (params, row) => {
        return `${moment(params.row.createDate).format("L LT")}`;
      },
    },
    {
      field: "_id",
      headerName: "",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              setOpen({
                messageData: params.row.messageId.messageData,
                userId:
                  params.row.type === "service"
                    ? params.row.personalUserId._id
                    : params.row.serviceUserId._id,
                type: params.row.type === "service" ? "personal" : "service",
                isBlock:
                  params.row.type === "service"
                    ? params.row.personalUserId.status === "blocked"
                    : params.row.serviceUserId.status === "blocked",
              });
            }}
            size="small"
            variant="outlined"
          >
            Görüntüle
          </Button>
        );
      },
    },
  ];

  const getReportList = () => {
    AxiosRequest("post", ApiRoutes.report.getList)
      .then(async (res) => {
        await setLoad(false);
        await setData(res.data.reverse());
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const changeUserStatus = (value) => {
    AxiosRequest("post", ApiRoutes.user.changeStatus, {
      userId: value.userId,
      type: value.type,
      status: value.status,
    })
      .then(async (res) => {
        await setLoad(false);
        await setOpen();
        await enqueueSnackbar("Başarıyla düzenlendi.", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        await getReportList();
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getReportList();
  }, []);

  return (
    <>
      <NestedModal
        open={open}
        handleClose={handleClose}
        blockPress={async (e) => {
          await setLoad(true);
          await changeUserStatus({
            userId: open.userId,
            type: open.type,
            status: open.isBlock ? "online" : "blocked",
          });
        }}
      />
      <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
        {data && data.length ? (
          <Grid size={{ xs: 12, lg: 9 }}>
            <DataGrid
              autoHeight
              rows={data}
              columns={columns}
              rowSelection={false}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
              }}
              getRowId={(i) => i._id}
              pageSizeOptions={[10, 20, 50]}
              density="compact"
              slotProps={{
                filterPanel: {
                  filterFormProps: {
                    logicOperatorInputProps: {
                      variant: "outlined",
                      size: "small",
                    },
                    columnInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    operatorInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    valueInputProps: {
                      InputComponentProps: {
                        variant: "outlined",
                        size: "small",
                      },
                    },
                  },
                },
              }}
            />
          </Grid>
        ) : (
          <LinearProgress />
        )}
      </Box>
    </>
  );
};

export default Errors;
