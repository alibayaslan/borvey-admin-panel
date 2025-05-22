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
  OutlinedInput,
  Checkbox,
  ListItemText,
  LinearProgress,
  FormHelperText,
} from "@mui/material";
import { Formik, Form } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import Grid from "@mui/material/Grid2";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { AxiosRequest } from "../../utils/AxiosRequest";
import { SnackbarProvider, useSnackbar } from "notistack";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Settings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoad, setLoad] = useState(true);
  const [error, setError] = useState();
  const [postData, setPostData] = useState();
  const [firmData, setFirmData] = useState();
  const [siteSetting, setSiteSetting] = useState();

  const LoginSchema = Yup.object().shape({
    posts: Yup.array()
      .of(Yup.string()) // Array'in her bir elemanının string olmasını kontrol eder
      .min(3, "Posts alanı en az 3 öğe içermelidir.")
      .required("Posts alanı zorunludur."),
    firms: Yup.array()
      .of(Yup.string()) // Array'in her bir elemanının string olmasını kontrol eder
      .min(3, "Firms alanı en az 3 öğe içermelidir.")
      .required("Firms alanı zorunludur."),
  });

  const getFirmList = () => {
    AxiosRequest("post", ApiRoutes.user.getList)
      .then(async (res) => {
        await setLoad(false);
        const filterData = res.data.filter(
          (i) => i.type === "service" && i.status === "online"
        );
        await setFirmData(filterData);
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const getPostList = () => {
    AxiosRequest("post", ApiRoutes.post.getList)
      .then(async (res) => {
        await setLoad(false);
        const filterData = res.data.filter((i) => i.status === "online");
        await setPostData(filterData);
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const getSiteSetting = () => {
    AxiosRequest("post", ApiRoutes.setting.get)
      .then(async (res) => {
        await setSiteSetting(res.data);
      })
      .catch((err) => {
        setLoad(false);
      });
  };

  const updateSettings = (val) => {
    AxiosRequest("post", ApiRoutes.setting.update, {
      ...val,
      homepage: {
        title: val.homepageTitle,
        description: val.homepageDescription,
        tags: val.homepageTags,
      },
      about: {
        title: val.aboutTitle,
        description: val.aboutDescription,
        tags: val.aboutTags,
      },
      faq: {
        title: val.faqTitle,
        description: val.faqDescription,
        tags: val.faqTags,
      },
      contact: {
        title: val.contactTitle,
        description: val.contactDescription,
        tags: val.contactTags,
      },
    })
      .then(async (res) => {
        await setLoad(false);
        enqueueSnackbar("Başarıyla düzenlendi.", {
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
    getFirmList();
    getPostList();
    getSiteSetting();
  }, []);

  console.log("val", siteSetting);
  return (
    <>
      <Box sx={{ width: "100%", margin: "0 auto" }}>
        <>{isLoad ? <LinearProgress /> : null}</>

        {postData && firmData ? (
          <>
            <Formik
              initialValues={{
                posts:
                  siteSetting.posts && siteSetting.posts.length
                    ? siteSetting.posts.filter((item) =>
                        postData.map((i) => i._id).includes(item)
                      )
                    : [],
                firms:
                  siteSetting.firms && siteSetting.firms.length
                    ? siteSetting.firms.filter((item) =>
                        firmData.map((i) => i._id).includes(item)
                      )
                    : [],

                homepageTitle: siteSetting.SEO.homepage.title,
                homepageDescription: siteSetting.SEO.homepage.description,
                homepageTags: siteSetting.SEO.homepage.tags,

                aboutTitle: siteSetting.SEO.about.title,
                aboutDescription: siteSetting.SEO.about.description,
                aboutTags: siteSetting.SEO.about.tags,

                faqTitle: siteSetting.SEO.faq.title,
                faqDescription: siteSetting.SEO.faq.description,
                faqTags: siteSetting.SEO.faq.tags,

                contactTitle: siteSetting.SEO.contact.title,
                contactDescription: siteSetting.SEO.contact.description,
                contactTags: siteSetting.SEO.contact.tags,
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                setLoad(true);
                updateSettings(values);
                // API işlemleri burada yapılabilir.
              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue }) => (
                <Form id="payment" onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.posts && touched.posts}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            Öne Çıkan İlanlar
                          </FormLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={values.posts}
                            onChange={(e) => {
                              const selectedValues = e.target.value;

                              // Eğer seçim sayısı 3'ü geçiyorsa, önceki değerleri koruyalım
                              if (selectedValues.length > 3) {
                                return;
                              }

                              setFieldValue("posts", selectedValues); // Yeni değerleri ayarla
                            }}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                          >
                            {postData.map((item) => (
                              <MenuItem key={item.title} value={item._id}>
                                <Checkbox
                                  checked={values.posts.includes(item._id)}
                                />
                                <ListItemText primary={item.title} />
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.posts && touched.posts && (
                            <FormHelperText>{errors.posts}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.firms && touched.firms}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            Öne Çıkan Firmalar
                          </FormLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={values.firms}
                            onChange={(e) => {
                              setFieldValue("firms", e.target.value); // Yeni değerleri ayarla
                            }}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => {
                              return selected.join(", ");
                            }}
                            MenuProps={MenuProps}
                          >
                            {firmData.map((item) => (
                              <MenuItem key={item._id} value={item._id}>
                                <Checkbox
                                  checked={values.firms.includes(item._id)}
                                />
                                <ListItemText primary={item.firm.name} />
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.firms && touched.firms && (
                            <FormHelperText>{errors.posts}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.homepageTitle && touched.homepageTitle}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">Anasayfa Title</FormLabel>
                          <TextField
                            error={
                              errors.homepageTitle && touched.homepageTitle
                            }
                            helperText={
                              touched.homepageTitle && errors.homepageTitle
                            }
                            id="homepageTitle"
                            name="homepageTitle"
                            placeholder="Anasayfa Title"
                            variant="outlined"
                            value={values.homepageTitle}
                            onChange={(e) =>
                              setFieldValue("homepageTitle", e.target.value)
                            }
                          />
                          {errors.homepageTitle && touched.homepageTitle && (
                            <FormHelperText>
                              {errors.homepageTitle}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={
                            errors.homepageDescription &&
                            touched.homepageDescription
                          }
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            Anasayfa Description
                          </FormLabel>
                          <TextField
                            error={
                              errors.homepageDescription &&
                              touched.homepageDescription
                            }
                            helperText={
                              touched.homepageDescription &&
                              errors.homepageDescription
                            }
                            id="homepageDescription"
                            name="homepageDescription"
                            placeholder="Anasayfa Description"
                            variant="outlined"
                            value={values.homepageDescription}
                            onChange={(e) =>
                              setFieldValue(
                                "homepageDescription",
                                e.target.value
                              )
                            }
                          />
                          {errors.homepageDescription &&
                            touched.homepageDescription && (
                              <FormHelperText>
                                {errors.homepageDescription}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.homepageTags && touched.homepageTags}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            {"Anasayfa Tags (virgül ile ayırın)"}
                          </FormLabel>
                          <TextField
                            error={errors.homepageTags && touched.homepageTags}
                            helperText={
                              touched.homepageTags && errors.homepageTags
                            }
                            id="homepageTags"
                            name="homepageTags"
                            placeholder="Anasayfa Tag(virgül ile ayırın)"
                            variant="outlined"
                            value={values.homepageTags}
                            onChange={(e) =>
                              setFieldValue("homepageTags", e.target.value)
                            }
                          />
                          {errors.homepageTags && touched.homepageTags && (
                            <FormHelperText>
                              {errors.homepageTags}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.aboutTitle && touched.aboutTitle}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">Hakkımızda Title</FormLabel>
                          <TextField
                            error={errors.aboutTitle && touched.aboutTitle}
                            helperText={touched.aboutTitle && errors.aboutTitle}
                            id="aboutTitle"
                            name="aboutTitle"
                            placeholder="Hakkımızda Title"
                            variant="outlined"
                            value={values.aboutTitle}
                            onChange={(e) =>
                              setFieldValue("aboutTitle", e.target.value)
                            }
                          />
                          {errors.aboutTitle && touched.aboutTitle && (
                            <FormHelperText>{errors.aboutTitle}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={
                            errors.aboutDescription && touched.aboutDescription
                          }
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            Hakkımızda Description
                          </FormLabel>
                          <TextField
                            error={
                              errors.aboutDescription &&
                              touched.aboutDescription
                            }
                            helperText={
                              touched.aboutDescription &&
                              errors.aboutDescription
                            }
                            id="aboutDescription"
                            name="aboutDescription"
                            placeholder="Hakkımızda Description"
                            variant="outlined"
                            value={values.aboutDescription}
                            onChange={(e) =>
                              setFieldValue("aboutDescription", e.target.value)
                            }
                          />
                          {errors.aboutDescription &&
                            touched.aboutDescription && (
                              <FormHelperText>
                                {errors.aboutDescription}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.aboutTags && touched.aboutTags}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            {"Hakkımızda Tags (virgül ile ayırın)"}
                          </FormLabel>
                          <TextField
                            error={errors.aboutTags && touched.aboutTags}
                            helperText={touched.aboutTags && errors.aboutTags}
                            id="aboutTags"
                            name="aboutTags"
                            placeholder="Hakkımızda Tag(virgül ile ayırın)"
                            variant="outlined"
                            value={values.aboutTags}
                            onChange={(e) =>
                              setFieldValue("aboutTags", e.target.value)
                            }
                          />
                          {errors.aboutTags && touched.aboutTags && (
                            <FormHelperText>{errors.aboutTags}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.faqTitle && touched.faqTitle}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">FAQ Title</FormLabel>
                          <TextField
                            error={errors.faqTitle && touched.faqTitle}
                            helperText={touched.faqTitle && errors.faqTitle}
                            id="faqTitle"
                            name="faqTitle"
                            placeholder="FAQ Title"
                            variant="outlined"
                            value={values.faqTitle}
                            onChange={(e) =>
                              setFieldValue("faqTitle", e.target.value)
                            }
                          />
                          {errors.faqTitle && touched.faqTitle && (
                            <FormHelperText>{errors.faqTitle}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={
                            errors.faqDescription && touched.faqDescription
                          }
                          fullWidth
                        >
                          <FormLabel htmlFor="city">FAQ Description</FormLabel>
                          <TextField
                            error={
                              errors.faqDescription && touched.faqDescription
                            }
                            helperText={
                              touched.faqDescription && errors.faqDescription
                            }
                            id="faqDescription"
                            name="faqDescription"
                            placeholder="FAQ Description"
                            variant="outlined"
                            value={values.faqDescription}
                            onChange={(e) =>
                              setFieldValue("faqDescription", e.target.value)
                            }
                          />
                          {errors.faqDescription && touched.faqDescription && (
                            <FormHelperText>
                              {errors.faqDescription}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.faqTags && touched.faqTags}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            {"FAQ Tags (virgül ile ayırın)"}
                          </FormLabel>
                          <TextField
                            error={errors.faqTags && touched.faqTags}
                            helperText={touched.faqTags && errors.faqTags}
                            id="faqTags"
                            name="faqTags"
                            placeholder="FAQ Tag(virgül ile ayırın)"
                            variant="outlined"
                            value={values.faqTags}
                            onChange={(e) =>
                              setFieldValue("faqTags", e.target.value)
                            }
                          />
                          {errors.faqTags && touched.faqTags && (
                            <FormHelperText>{errors.faqTags}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.contactTitle && touched.contactTitle}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">İletişim Title</FormLabel>
                          <TextField
                            error={errors.contactTitle && touched.contactTitle}
                            helperText={
                              touched.contactTitle && errors.contactTitle
                            }
                            id="contactTitle"
                            name="contactTitle"
                            placeholder="İletişim Title"
                            variant="outlined"
                            value={values.contactTitle}
                            onChange={(e) =>
                              setFieldValue("contactTitle", e.target.value)
                            }
                          />
                          {errors.contactTitle && touched.contactTitle && (
                            <FormHelperText>
                              {errors.contactTitle}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={
                            errors.contactDescription &&
                            touched.contactDescription
                          }
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            İletişim Description
                          </FormLabel>
                          <TextField
                            error={
                              errors.contactDescription &&
                              touched.contactDescription
                            }
                            helperText={
                              touched.contactDescription &&
                              errors.contactDescription
                            }
                            id="contactDescription"
                            name="contactDescription"
                            placeholder="İletişim Description"
                            variant="outlined"
                            value={values.contactDescription}
                            onChange={(e) =>
                              setFieldValue(
                                "contactDescription",
                                e.target.value
                              )
                            }
                          />
                          {errors.contactDescription &&
                            touched.contactDescription && (
                              <FormHelperText>
                                {errors.contactDescription}
                              </FormHelperText>
                            )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                          error={errors.contactTags && touched.contactTags}
                          fullWidth
                        >
                          <FormLabel htmlFor="city">
                            {"İletişim Tags (virgül ile ayırın)"}
                          </FormLabel>
                          <TextField
                            error={errors.contactTags && touched.contactTags}
                            helperText={
                              touched.contactTags && errors.contactTags
                            }
                            id="contactTags"
                            name="contactTags"
                            placeholder="İletişim Tag(virgül ile ayırın)"
                            variant="outlined"
                            value={values.contactTags}
                            onChange={(e) =>
                              setFieldValue("contactTags", e.target.value)
                            }
                          />
                          {errors.contactTags && touched.contactTags && (
                            <FormHelperText>
                              {errors.contactTags}
                            </FormHelperText>
                          )}
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
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          </>
        ) : null}
      </Box>
    </>
  );
};

export default Settings;
