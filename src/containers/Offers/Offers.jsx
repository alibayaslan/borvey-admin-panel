import { Box, Grid, LinearProgress, Avatar, Chip, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function renderStatus(status) {
  const colors = {
    hold: {
      color: "default",
      text: "Beklemede",
    },

    decline: {
      color: "error",
      text: "Rededildi",
    },
    accept: {
      color: "success",
      text: "Kabul Edildi",
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

const Offers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [isLoad, setLoad] = useState(false);

  const columns = [
    {
      field: "postTitle",
      headerName: "İlan Başlığı",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.postID.title}`;
      },
    },
    {
      field: "userName",
      headerName: "İlan Sahibi",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.personalUserID.name} ${row.personalUserID.surname}`;
      },
    },
    {
      field: "firmName",
      headerName: "Firma İsmi",
      flex: 0.5,
      minWidth: 80,
      valueGetter: (value, row) => {
        return `${row.serviceUserID.firm.name}`;
      },
    },
    {
      field: "price",
      headerName: "Firma İsmi",
      flex: 0.5,
      minWidth: 80,
      valueGetter: (value, row) => {
        return `${value}₺`;
      },
    },

    {
      field: "createDate",
      headerName: "Teklif Tarihi",
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
      field: "status",
      headerName: "Post Durumu",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => renderStatus(params.value),
    },
  ];

  const getOfferList = () => {
    AxiosRequest("post", ApiRoutes.offer.getList)
      .then(async (res) => {
        await setLoad(false);
        await setData(res.data.reverse());
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getOfferList();
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

export default Offers;
