import { Box, Grid, LinearProgress, Avatar, Chip, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
      text: "Silinmiş",
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

const Users = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isLoad, setLoad] = useState(false);
  const [searchParams] = useSearchParams();

  const columns = [
    {
      field: "avatar",
      headerName: "",
      flex: 0.5,
      minWidth: 40,
      renderCell: (params) => {
        return renderAvatar({
          name: params.row.name,
          image: params.value,
        });
      },
    },
    {
      field: "name",
      headerName: "İsim Soyisim",
      flex: 1,
      minWidth: 40,
      valueGetter: (value, row) => {
        return `${row.name} ${row.surname}`;
      },
    },
    {
      field: "type",
      headerName: "Üye Tipi",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderType(params.value),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Üye Durumu",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.value),
    },

    {
      field: "firm",
      headerName: "Firma Adı",
      flex: 1,
      valueGetter: (value, row) => {
        return `${value ? value.name : ""}`;
      },
    },

    {
      field: "registerDate",
      headerName: "Kayıt Tarihi",
      flex: 1,
      type: "dateTime",
      valueGetter: (params, row) => {
        return new Date(params);
      },
      renderCell: (params, row) => {
        return `${moment(params.row.registerDate).format("L LT")}`;
      },
    },
    {
      field: "deletedReason",
      headerName: "Silinme Sebebi",
      flex: 1,
      valueGetter: (value, row) => {
        return `${
          row.status === "deleted" && row.deleteReason ? row.deleteReason : ""
        }`;
      },
    },

    {
      field: "_id",
      headerName: "",

      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Button
          onClick={() => {
            navigate(`/user/${params.value}`);
          }}
          size="small"
          variant="outlined"
        >
          Düzenle
        </Button>
      ),
    },
  ];

  const getUserList = () => {
    AxiosRequest("post", ApiRoutes.user.getList)
      .then(async (res) => {
        await setLoad(false);
        await setData(res.data.reverse());
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    console.log("location", searchParams.get("filter"));
  }, [searchParams]);

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
                filter: {
                  filterModel: {
                    items: [
                      searchParams.get("filter") === "service"
                        ? {
                            field: "type",
                            operator: "equals",
                            value: "service",
                          }
                        : null,
                      searchParams.get("filter") === "personal"
                        ? {
                            field: "type",
                            operator: "equals",
                            value: "personal",
                          }
                        : null,
                      searchParams.get("filter") === "deletedUser"
                        ? {
                            field: "status",
                            operator: "equals",
                            value: "deleted",
                          }
                        : null,
                    ].filter(Boolean), // Null olan değerleri kaldırır
                  },
                },
              }}
              getRowId={(i) => i._id}
              pageSizeOptions={[10, 20, 50]}
              density="compact"
              slots={{ toolbar: GridToolbar }}
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

export default Users;
