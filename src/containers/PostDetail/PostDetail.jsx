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
} from "@mui/material";
import { Formik, Form } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import Grid from "@mui/material/Grid2";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { useLocation } from "react-router-dom";
import { CityData } from "../../utils/CityData";
import { useSnackbar } from "notistack";

const PostDetail = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoad, setLoad] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();

  const location = useLocation();
  const currentId = location.pathname.split("/")[2];

  const LoginSchema = Yup.object().shape({
    title: Yup.string().required(`Başlık alanı zorunludur.`),
    type: Yup.string().required(`Tip alanı zorunludur.`),
    question: Yup.string().required(`Soru alanı zorunludur.`),
    answer: Yup.string().required(`Cevap alanı zorunludur.`),
    additionalInfo: Yup.string().required(`Ek Bilgi alanı zorunludur.`),
    addressFromCity: Yup.string().required(`Adres alanı zorunludur.`),
    addressFromDistrict: Yup.string().required(`Adres alanı zorunludur.`),
    addressToCity: Yup.string().required(`Adres alanı zorunludur.`),
    addressToDistrict: Yup.string().required(`Adres alanı zorunludur.`),
  });

  const getPostDetail = () => {
    AxiosRequest("post", ApiRoutes.post.get, {
      postId: currentId,
    })
      .then(async (res) => {
        await setLoad(false);
        await setData({
          ...res.data,
          address: {
            from: {
              city: res.data.address.from.city.toLocaleUpperCase("tr-TR"),
              district: res.data.address.from.district,
            },
            to: {
              city: res.data.address.to.city.toLocaleUpperCase("tr-TR"),
              district: res.data.address.to.district,
            },
          },
        });
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const editPost = (val) => {
    AxiosRequest("post", ApiRoutes.post.edit, {
      postId: currentId,
      title: val.title,
      type: val.type,
      questions: [
        {
          question: val.question,
          answer: val.answer,
        },
      ],
      additionalInfo: val.additionalInfo,
      address: {
        from: {
          city: val.addressFromCity,
          district: val.addressFromDistrict,
        },
        to: {
          city: val.addressToCity,
          district: val.addressToDistrict,
        },
      },
    })
      .then(async (res) => {
        await setLoad(false);
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

  const changePost = (val) => {
    AxiosRequest("post", ApiRoutes.post.change, {
      postId: currentId,
      status: val,
    })
      .then(async (res) => {
        await setLoad(false);
        await setData({
          ...data,
          status: val,
        });
        await enqueueSnackbar(
          val === "blocked"
            ? "Başarıyla bloklandı."
            : "Başarıyla yayına alındı.",
          {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          }
        );
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getPostDetail();
  }, []);

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
              İlan Detayı
            </Typography>
          </Stack>

          <Stack spacing={2} alignItems={"center"}>
            <Formik
              initialValues={{
                title: data.title,
                type: data.type,
                question: data.questions[0].question,
                answer: data.questions[0].answer,
                additionalInfo: data.additionalInfo,
                addressFromCity: data.address.from.city,
                addressFromDistrict: data.address.from.district,
                addressToCity: data.address.to.city,
                addressToDistrict: data.address.to.district,
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                setLoad(true);
                editPost(values);
                // API işlemleri burada yapılabilir.
              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue }) => (
                <Form id="payment" onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <Grid container spacing={2}>
                      {/* İsim */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="title">Başlık</FormLabel>
                          <TextField
                            error={errors.title && touched.title}
                            helperText={touched.title && errors.title}
                            id="title"
                            name="title"
                            placeholder="Başlık"
                            variant="outlined"
                            value={values.title}
                            onChange={(e) =>
                              setFieldValue("title", e.target.value)
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="type">Nakliyat Tipi</FormLabel>
                          <Select
                            labelId="type"
                            id="type"
                            value={values.type}
                            onChange={(e) =>
                              setFieldValue("type", e.target.value)
                            }
                          >
                            <MenuItem value="home">Evden Eve</MenuItem>
                            <MenuItem value="single">Tekil Ürün</MenuItem>
                            <MenuItem value="office">Ofis</MenuItem>
                            <MenuItem value="short">Kısa Mesafe</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="question">Soru</FormLabel>
                          <TextField
                            error={errors.question && touched.question}
                            helperText={touched.question && errors.question}
                            id="question"
                            name="question"
                            placeholder="Soru"
                            variant="outlined"
                            value={values.question}
                            onChange={(e) =>
                              setFieldValue("question", e.target.value)
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="answer">Cevap</FormLabel>
                          <TextField
                            error={errors.answer && touched.answer}
                            helperText={touched.answer && errors.answer}
                            id="answer"
                            name="answer"
                            placeholder="Cevap"
                            variant="outlined"
                            value={values.answer}
                            onChange={(e) =>
                              setFieldValue("answer", e.target.value)
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="additionalInfo">
                            Ek Bilgi
                          </FormLabel>
                          <TextField
                            error={
                              errors.additionalInfo && touched.additionalInfo
                            }
                            helperText={
                              touched.additionalInfo && errors.additionalInfo
                            }
                            id="additionalInfo"
                            name="additionalInfo"
                            placeholder="Ek Bilgi"
                            variant="outlined"
                            value={values.additionalInfo}
                            onChange={(e) =>
                              setFieldValue("additionalInfo", e.target.value)
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="addressFromCity">
                            Alınacak Şehir
                          </FormLabel>
                          <Select
                            labelId="addressFromCity"
                            id="addressFromCity"
                            value={values.addressFromCity}
                            onChange={(e) => {
                              setFieldValue("addressFromCity", e.target.value);
                              setFieldValue("addressFromDistrict", "");
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
                          <FormLabel htmlFor="addressFromDistrict">
                            Alınacak İlçe
                          </FormLabel>
                          <Select
                            labelId="addressFromDistrict"
                            id="addressFromDistrict"
                            value={values.addressFromDistrict}
                            onChange={(e) =>
                              setFieldValue(
                                "addressFromDistrict",
                                e.target.value
                              )
                            }
                          >
                            {CityData.find(
                              (i) =>
                                i.il_adi.toLocaleLowerCase("tr-TR") ===
                                values.addressFromCity.toLocaleLowerCase(
                                  "tr-TR"
                                )
                            ).ilceler.map((item) => {
                              return (
                                <MenuItem value={item.ilce_adi}>
                                  {item.ilce_adi}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor="addressToCity">
                            Teslim Edilecek Şehir
                          </FormLabel>
                          <Select
                            labelId="addressToCity"
                            id="addressToCity"
                            value={values.addressToCity}
                            onChange={(e) => {
                              setFieldValue("addressToCity", e.target.value);
                              setFieldValue("addressToDistrict", "");
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
                          <FormLabel htmlFor="addressToDistrict">
                            Teslim Edilecek İlçe
                          </FormLabel>
                          <Select
                            labelId="addressToDistrict"
                            id="addressToDistrict"
                            value={values.addressToDistrict}
                            onChange={(e) =>
                              setFieldValue("addressToDistrict", e.target.value)
                            }
                          >
                            {CityData.find(
                              (i) =>
                                i.il_adi.toLocaleLowerCase("tr-TR") ===
                                values.addressToCity.toLocaleLowerCase("tr-TR")
                            ).ilceler.map((item) => {
                              return (
                                <MenuItem value={item.ilce_adi}>
                                  {item.ilce_adi}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Hata Mesajı */}
                    {error === "loginError" && (
                      <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                      </Typography>
                    )}

                    {/* Düzenle Butonu */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                      >
                        Düzenle
                      </Button>
                      {data.status === "online" || data.status === "blocked" ? (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            changePost(
                              data.status === "online" ? "blocked" : "online"
                            );
                          }}
                          variant="contained"
                          color={data.status === "online" ? "error" : "success"}
                          fullWidth
                          sx={{ mt: 3 }}
                        >
                          {data.status === "online"
                            ? "İlanı Blokla"
                            : "İlanı Yayına Al"}
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Stack>
        </>
      ) : null}
    </Box>
  );
};

export default PostDetail;
