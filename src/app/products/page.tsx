"use client";

import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const COLOR_IMAGE_MAP: Record<string, string> = {
  black: "https://aersf.com/cdn/shop/files/Black.png?v=1686201902",
  gray: "https://aersf.com/cdn/shop/files/Gray.png?v=1687901508",
  navy: "https://aersf.com/cdn/shop/files/Navy.png?v=1687895961",
  olive: "https://aersf.com/cdn/shop/files/olive.png?v=1715366173",
  "x-pac": "https://aersf.com/cdn/shop/files/X-Pac.png?v=1686201902",
  ultra: "https://aersf.com/cdn/shop/files/ultra.png?v=1723300658",
  "safety orange":
    "https://aersf.com/cdn/shop/files/safety-orange.png?v=1715313864",
  "fog white": "https://aersf.com/cdn/shop/files/fog-white.png?v=1715313864",
  "pale mauve": "https://aersf.com/cdn/shop/files/pale-mauve.png?v=1715313864",
  "lunar gray": "https://aersf.com/cdn/shop/files/Lunar-Gray.png?v=1686202058",
};

export default function ProductsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const selectedProducts =
    products.length > 0
      ? selectedIds.map(
          (id) => products.find((p) => p.id === id) || products[0],
        )
      : [];

  const featureKeys =
    products.length > 0 ? Object.keys(products[0]?.features || {}) : [];

  const handleSelect = (index: number, newId: string) => {
    const updated = [...selectedIds];
    updated[index] = newId;
    setSelectedIds(updated);
  };

  async function fetchProducts() {
    const url = "http://localhost:8080/products";
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products, status: ${response.status}`);
    }

    const raw = await response.json();

    const transformed = raw.map((p: any) => ({
      id: p.id,
      name: p.title,
      imageUrl: p.image,
      description: p.description,
      features: {
        "Product Details": p.product_details
          ? p.product_details
              .split(",")
              .map((line: string) => line.trim())
              .join("\n\n")
          : "-",
        Dimensions: p.dimensions || "—",
        Volume: p.volume ? `${p.volume} L` : "—",
        Weight: p.weight ? `${p.weight} lbs` : "—",
        Price: p.price ? `$${p.price}` : "—",
        Color: p.colors
          ? p.colors.split(",").map((name: string) => {
              const key = name.trim().toLowerCase();
              return {
                name: name.trim(),
                imageUrl: COLOR_IMAGE_MAP[key] || "",
              };
            })
          : [],
      },
    }));

    return transformed;
  }

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
        .then((data) => {
          setProducts(data);
          setSelectedIds(data.slice(0, 3).map((p) => p.id));
        })
        .catch((e) => {
          console.error("Error fetching products:", e);
        });
    }
  }, [products]);

  if (products.length === 0 || selectedProducts.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <>
      {/* Hero Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 250, sm: 350, md: 450 },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        {/* Responsive image as background */}
        <Box
          component="img"
          src="https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_900x.jpg?v=1715544323"
          srcSet="
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_360x.jpg?v=1715544323 360w,
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_540x.jpg?v=1715544323 540w,
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_720x.jpg?v=1715544323 720w,
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_900x.jpg?v=1715544323 900w,
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_1080x.jpg?v=1715544323 1080w,
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_1296x.jpg?v=1715544323 1296w,
            https://aersf.com/cdn/shop/files/2023_homepage_wide_travel1_0658afb3-b90d-4a2e-b89b-c43e5147220d_2048x.jpg?v=1715544323 2048w
          "
          sizes="100vw"
          alt="AER travel"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        {/* Overlayed title */}
        <Typography
          variant="h3"
          sx={{
            position: "relative",
            zIndex: 1,
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
            textAlign: "center",
            px: 2,
          }}
        >
          Compare AER Products
        </Typography>
      </Box>

      {/* Sticky dropdowns ONLY */}
      <Box
        sx={{
          position: "sticky",
          top: "64px",
          zIndex: 20,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          py: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {selectedProducts.map((product, index) => (
            <Grid item xs={12} sm={4} key={index} textAlign="center">
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select a product</InputLabel>
                <Select
                  value={selectedIds[index]}
                  label="Select a product"
                  onChange={(e) => handleSelect(index, e.target.value)}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Products images & names (not sticky) */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {selectedProducts.map((product, index) => (
            <Grid item xs={12} sm={4} key={"img-" + index} textAlign="center">
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name}
                sx={{ height: 200, objectFit: "contain", mb: 1 }}
              />
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Main Content Table */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  width: 150,
                  whiteSpace: "nowrap",
                }}
              >
                Feature
              </TableCell>
              {selectedProducts.map((product) => (
                <TableCell
                  key={product.id}
                  align="center"
                  sx={{ fontWeight: "bold", width: 300 }}
                >
                  {product.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {featureKeys.map((key) => (
              <TableRow key={key}>
                <TableCell
                  sx={{
                    width: 150,
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    fontWeight: 500,
                    verticalAlign: "top",
                  }}
                >
                  {key}
                </TableCell>
                {selectedProducts.map((product) => (
                  <TableCell
                    key={product.id + key}
                    align="center"
                    sx={{
                      width: 300,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      textAlign: "left",
                      verticalAlign: "top",
                    }}
                  >
                    {key === "Color" && Array.isArray(product.features[key]) ? (
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {product.features[key].map(
                          (color: any, idx: number) => (
                            <Box
                              key={idx}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <Box
                                component="img"
                                src={color.imageUrl}
                                alt={color.name}
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "1px solid #ccc",
                                }}
                              />
                              <Typography variant="body2">
                                {color.name}
                              </Typography>
                            </Box>
                          ),
                        )}
                      </Box>
                    ) : (
                      product.features?.[key] || "—"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
}
