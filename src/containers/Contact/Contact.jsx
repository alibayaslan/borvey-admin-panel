import { Box, Grid, LinearProgress, Avatar, Chip, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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

const Contact = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isLoad, setLoad] = useState(false);

  const columns = [
    {
      field: "name",
      headerName: "İsim",
      flex: 1,
      minWidth: 40,
    },
    {
      field: "surname",
      headerName: "Soyisim",
      flex: 1,
      minWidth: 40,
    },
    {
      field: "phone",
      headerName: "Telefon",
      flex: 1,
      minWidth: 40,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "message",
      headerName: "Mesaj",
      flex: 1,
      minWidth: 120,
    },

    {
      field: "createdDate",
      headerName: "Tarih",
      flex: 1,
      type: "dateTime",
      valueGetter: (params, row) => {
        return new Date(params);
      },
      renderCell: (params, row) => {
        return `${moment(params.row.createdDate).format("L LT")}`;
      },
    },
  ];

  const getContactList = () => {
    AxiosRequest("post", ApiRoutes.contact.getList)
      .then(async (res) => {
        await setLoad(false);
        await setData(res.data.reverse());
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getContactList();
  }, []);

  return (
    <>
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

export default Contact;
