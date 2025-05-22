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
      color: "default",
      text: "Online",
    },
    working: {
      color: "info",
      text: "Çalışıyor",
    },
    offline: {
      color: "warning",
      text: "Offline",
    },
    blocked: {
      color: "error",
      text: "Engelli",
    },
    completed: {
      color: "success",
      text: "Tamamlandı",
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
    home: {
      color: "info",
      text: "Evden Eve",
    },
    single: {
      color: "success",
      text: "Tekli",
    },
    office: {
      color: "warning",
      text: "Ofis",
    },
    short: {
      color: "default",
      text: "Kısa Mesafe",
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

const Posts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isLoad, setLoad] = useState(false);

  const columns = [
    {
      field: "title",
      headerName: "Başlık",
      flex: 0.5,
      minWidth: 40,
    },
    {
      field: "additionalInfo",
      headerName: "Açıklama",
      flex: 0.5,
      minWidth: 40,
    },
    {
      field: "type",
      headerName: "Post Tipi",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderType(params.value),
    },
    {
      field: "user",
      headerName: "Kullanıcı",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.userId.email}`;
      },
    },
    {
      field: "status",
      headerName: "Post Durumu",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.value),
    },
    {
      field: "totalOffer",
      headerName: "Toplam Teklif",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.offers ? row.offers.length : 0}`;
      },
    },

    {
      field: "date",
      headerName: "İlan Tarihi",
      flex: 1,
      type: "dateTime",
      valueGetter: (params, row) => {
        console.log("params", params);
        return new Date(params);
      },
      renderCell: (params, row) => {
        return `${moment(params.row.date).format("L LT")}`;
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
            navigate(`/post/${params.value}`);
          }}
          size="small"
          variant="outlined"
        >
          Düzenle
        </Button>
      ),
    },
  ];

  const getPostList = () => {
    AxiosRequest("post", ApiRoutes.post.getList)
      .then(async (res) => {
        await setLoad(false);
        await setData(res.data.reverse());
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getPostList();
  }, []);

  console.log("data", data);

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

export default Posts;
