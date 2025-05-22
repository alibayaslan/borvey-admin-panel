import {
  Avatar,
  Chip,
  Stack,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  LinearProgress,
  Divider,
  ListItemText,
} from "@mui/material";
import { Formik, Form } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import Grid from "@mui/material/Grid2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { CityData } from "../../utils/CityData";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UserDetail = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoad, setLoad] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [avatar, setAvatar] = useState();
  const [logo, setLogo] = useState();

  const location = useLocation();
  const currentId = location.pathname.split("/")[2];

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(`Lütfen doğru bir email adresi giriniz.`)
      .required(`Email alanı zorunlu.`),
    name: Yup.string().required(`Soru alanı zorunludur.`),
    surname: Yup.string().required(`Soru alanı zorunludur.`),
  });

  const getUser = () => {
    AxiosRequest("post", ApiRoutes.user.get, {
      userId: currentId,
    })
      .then(async (res) => {
        await setLoad(false);
        await setData(res.data);
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const editUser = (value) => {
    let formData = new FormData();
    formData.append("userId", currentId);
    formData.append("type", data.firm ? "service" : "personal");
    formData.append("name", value.name);
    formData.append("surname", value.surname);
    formData.append("phone", value.phone);
    formData.append("city", value.city);
    formData.append("district", value.district);
    formData.append(
      "avatar",
      value.avatar === "delete" ? "" : data.avatar ? data.avatar : ""
    );
    if (avatar) {
      formData.append("image", avatar);
    }
    AxiosRequest("post", ApiRoutes.user.edit, formData)
      .then(async (res) => {
        await setLoad(false);
        await enqueueSnackbar("Başarıyla düzenlendi.", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });

        if (value.avatar === "delete") {
          setData({
            ...data,
            avatar: "",
          });
        }
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const editFirm = (values) => {
    let formData = new FormData();
    formData.append("userId", currentId);
    formData.append("name", values.firmName);
    formData.append("address", values.firmAddress);
    formData.append("phone", values.firmPhone);
    formData.append("website", values.website);
    formData.append("description", values.description);
    formData.append("firmImages", JSON.stringify(data.firmImages));

    if (logo) {
      formData.append("firm-logo", logo);
    } else {
      formData.append("logo", data.firm.logo);
    }

    AxiosRequest("post", ApiRoutes.user.editFirm, formData)
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  };

  const changeUserStatus = (value) => {
    AxiosRequest("post", ApiRoutes.user.changeStatus, {
      userId: currentId,
      type: data.firm ? "service" : "personal",
      status: value,
    })
      .then(async (res) => {
        await setLoad(false);
        await setData({
          ...data,
          status: value,
        });
        await enqueueSnackbar("Başarıyla düzenlendi.", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log("data", data);

  return (
    <Box sx={{ width: "100%", margin: "0 auto" }}>
      {isLoad ? (
        <>
          <LinearProgress />
        </>
      ) : null}
      {data ? (
        <>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
            <Typography component="h2" variant="h6">
              Kullanıcı Detayları
            </Typography>
            <Chip
              avatar={
                <Avatar
                  alt={data.name + " " + data.surname}
                  src="/static/images/avatar/1.jpg"
                />
              }
              label={data.name + " " + data.surname}
              variant="outlined"
            />
          </Stack>

          <Stack spacing={2} alignItems={"center"}>
            {data.firm ? null : (
              <Stack
                alignItems={"center"}
                gap={2}
                width={{ sx: "50%", lg: "50%" }}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={avatar ? URL.createObjectURL(avatar) : data.avatar}
                  sx={{ width: 56, height: 56 }}
                />
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Avatar Yükle
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => setAvatar(event.target.files[0])}
                    accept="image/*"
                  />
                </Button>
                {data.avatar || avatar ? (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();

                      if (data.avatar) {
                        setAvatar();
                        editUser({
                          ...data,
                          avatar: "delete",
                        });
                      }
                    }}
                    variant="contained"
                    color="error"
                  >
                    Avatarı Sil
                  </Button>
                ) : null}
              </Stack>
            )}

            <Formik
              initialValues={
                data.firm
                  ? {
                      name: data.name,
                      surname: data.surname,
                      phone: data.phone,
                      email: data.email,
                      password: "",
                      city: data.city,
                      district: data.district,
                      firmName: data.firm.name,
                      firmAddress: data.firm.address,
                      website: data.firm.website,
                      firmPhone: data.firm.phone,
                      description: data.firm.description,
                    }
                  : {
                      name: data.name,
                      surname: data.surname,
                      phone: data.phone,
                      email: data.email,
                      password: "",
                      city: data.city,
                      district: data.district,
                    }
              }
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                setLoad(true);
                editUser(values);

                if (data.firm) {
                  editFirm(values);
                }
                // API işlemleri burada yapılabilir.
              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue }) => {
                return (
                  <Form id="payment" onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                      <Grid container spacing={2}>
                        {/* İsim */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <FormLabel htmlFor="name">İsim</FormLabel>
                            <TextField
                              error={errors.name && touched.name}
                              helperText={touched.name && errors.name}
                              id="name"
                              name="name"
                              placeholder="İsim"
                              variant="outlined"
                              value={values.name}
                              onChange={(e) =>
                                setFieldValue("name", e.target.value)
                              }
                            />
                          </FormControl>
                        </Grid>

                        {/* Soyisim */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <FormLabel htmlFor="surname">Soyisim</FormLabel>
                            <TextField
                              error={errors.surname && touched.surname}
                              helperText={touched.surname && errors.surname}
                              id="surname"
                              name="surname"
                              placeholder="Soyisim"
                              variant="outlined"
                              value={values.surname}
                              onChange={(e) =>
                                setFieldValue("surname", e.target.value)
                              }
                            />
                          </FormControl>
                        </Grid>

                        {/* Telefon */}
                        <Grid size={{ xs: 12, sm: 12 }}>
                          <FormControl fullWidth>
                            <FormLabel htmlFor="phone">Telefon</FormLabel>
                            <TextField
                              error={errors.phone && touched.phone}
                              helperText={touched.phone && errors.phone}
                              id="phone"
                              name="phone"
                              placeholder="Telefon"
                              variant="outlined"
                              value={values.phone}
                              onChange={(e) =>
                                setFieldValue("phone", e.target.value)
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <FormLabel htmlFor="city">Şehir</FormLabel>
                            <Select
                              labelId="city"
                              id="city"
                              value={
                                values.city
                                  ? values.city.toLocaleUpperCase("tr-TR")
                                  : values.city
                              }
                              onChange={(e) => {
                                setFieldValue("city", e.target.value);
                                setFieldValue("district", "");
                              }}
                            >
                              {CityData.map((item) => {
                                return (
                                  <MenuItem value={item.il_adi}>
                                    {item.il_adi}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormControl fullWidth>
                            <FormLabel htmlFor="district">İlçe</FormLabel>
                            <Select
                              labelId="district"
                              id="district"
                              value={values.district}
                              onChange={(e) =>
                                setFieldValue("district", e.target.value)
                              }
                            >
                              {values.city && values.city !== "undefined"
                                ? CityData.find((i) => {
                                    return (
                                      i.il_adi.toLocaleLowerCase("tr-TR") ===
                                      values.city.toLocaleLowerCase("tr-TR")
                                    );
                                  }).ilceler.map((item) => {
                                    return (
                                      <MenuItem value={item.ilce_adi}>
                                        {item.ilce_adi}
                                      </MenuItem>
                                    );
                                  })
                                : null}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Email */}
                        <Grid size={{ xs: 12, sm: 12 }}>
                          <FormControl fullWidth>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                              error={errors.email && touched.email}
                              helperText={touched.email && errors.email}
                              id="email"
                              name="email"
                              placeholder="Email"
                              variant="outlined"
                              value={values.email}
                              type="email"
                              onChange={(e) =>
                                setFieldValue("email", e.target.value)
                              }
                            />
                          </FormControl>
                        </Grid>
                        {data.firm ? (
                          <>
                            <Grid size={{ xs: 12, sm: 12 }}>
                              <ListItemText>Firma Bilgileri</ListItemText>
                              <Divider />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 12 }}>
                              <Stack spacing={2} alignItems={"center"}>
                                <Stack
                                  alignItems={"center"}
                                  gap={2}
                                  width={{ sx: "50%", lg: "50%" }}
                                >
                                  <Avatar
                                    alt="Remy Sharp"
                                    src={
                                      logo
                                        ? URL.createObjectURL(logo)
                                        : data.firm.logo
                                    }
                                    sx={{ width: 56, height: 56 }}
                                  />
                                  <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                  >
                                    Logo Yükle
                                    <VisuallyHiddenInput
                                      type="file"
                                      onChange={(event) =>
                                        setLogo(event.target.files[0])
                                      }
                                      accept="image/*"
                                    />
                                  </Button>
                                </Stack>
                              </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl fullWidth>
                                <FormLabel htmlFor="firmName">
                                  Firma Adı
                                </FormLabel>
                                <TextField
                                  error={errors.firmName && touched.firmName}
                                  helperText={
                                    touched.firmName && errors.firmName
                                  }
                                  id="firmName"
                                  name="firmName"
                                  placeholder="firmName"
                                  variant="outlined"
                                  value={values.firmName}
                                  onChange={(e) =>
                                    setFieldValue("firmName", e.target.value)
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl fullWidth>
                                <FormLabel htmlFor="firmAddress">
                                  Firma Adresi
                                </FormLabel>
                                <TextField
                                  error={
                                    errors.firmAddress && touched.firmAddress
                                  }
                                  helperText={
                                    touched.firmAddress && errors.firmAddress
                                  }
                                  id="firmAddress"
                                  name="firmAddress"
                                  placeholder="firmAddress"
                                  variant="outlined"
                                  value={values.firmAddress}
                                  onChange={(e) =>
                                    setFieldValue("firmAddress", e.target.value)
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl fullWidth>
                                <FormLabel htmlFor="website">
                                  Firma Websitesi
                                </FormLabel>
                                <TextField
                                  error={errors.website && touched.website}
                                  helperText={touched.website && errors.website}
                                  id="website"
                                  name="website"
                                  placeholder="Website"
                                  variant="outlined"
                                  value={values.website}
                                  onChange={(e) =>
                                    setFieldValue("website", e.target.value)
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl fullWidth>
                                <FormLabel htmlFor="firmPhone">
                                  Firma Telefonu
                                </FormLabel>
                                <TextField
                                  error={errors.firmPhone && touched.firmPhone}
                                  helperText={
                                    touched.firmPhone && errors.firmPhone
                                  }
                                  id="firmPhone"
                                  name="firmPhone"
                                  placeholder="Firma Telefonu"
                                  variant="outlined"
                                  value={values.firmPhone}
                                  onChange={(e) =>
                                    setFieldValue("firmPhone", e.target.value)
                                  }
                                />
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12 }}>
                              <FormControl fullWidth>
                                <FormLabel htmlFor="description">
                                  Firma Tanıtımı
                                </FormLabel>
                                <TextField
                                  error={
                                    errors.description && touched.description
                                  }
                                  helperText={
                                    touched.description && errors.description
                                  }
                                  id="description"
                                  name="description"
                                  placeholder="Firma Tanıtımı"
                                  variant="outlined"
                                  value={values.description}
                                  onChange={(e) =>
                                    setFieldValue("description", e.target.value)
                                  }
                                />
                              </FormControl>
                            </Grid>
                          </>
                        ) : null}

                        {/* Şifre */}
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <FormLabel htmlFor="password">Şifre</FormLabel>
                        <TextField
                          error={!!errors.password && touched.password}
                          helperText={touched.password && errors.password}
                          id="password"
                          name="password"
                          placeholder="••••••"
                          type="password"
                          variant="outlined"
                        />
                      </FormControl>
                    </Grid> */}
                      </Grid>

                      {/* Hata Mesajı */}
                      {error === "loginError" && (
                        <Typography color="error" sx={{ mt: 2 }}>
                          {error}
                        </Typography>
                      )}

                      {/* Düzenle Butonu */}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ mt: 3 }}
                        >
                          Düzenle
                        </Button>
                        {data.status === "online" ||
                        data.status === "blocked" ? (
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              changeUserStatus(
                                data.status === "online" ? "blocked" : "online"
                              );
                            }}
                            variant="contained"
                            color={
                              data.status === "online" ? "error" : "success"
                            }
                            fullWidth
                            sx={{ mt: 3 }}
                          >
                            {data.status === "online"
                              ? "Kullanıcıyı Blokla"
                              : "Kullanıcıyı Yayına Al"}
                          </Button>
                        ) : null}
                      </Stack>
                    </Stack>
                  </Form>
                );
              }}
            </Formik>
          </Stack>
        </>
      ) : null}
    </Box>
  );
};

export default UserDetail;
