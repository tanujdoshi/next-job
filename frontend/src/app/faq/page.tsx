"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { useTheme, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { faqData } from "./constants";
import "./styles.css";

export default function SimpleAccordion() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div style={{ padding: 30 }}>
      <div
        style={{
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          margin={2}
          marginTop={10}
          color={"primary"}
        >
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" margin={2} marginBottom={4}>
          Have questions? We're here to help.
        </Typography>
        <OutlinedInput
          className="searchBar"
          type="text"
          placeholder="Search Questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{paddingLeft:"5px"}}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      <div className="container">
        {faqData
          .filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                "&:before": {
                  display: "none",
                },
                background: "#F4F4F4",
                padding: 2,
              }}
              style={{
                margin: 8,
                borderRadius: 15,
              }}
              elevation={0}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography style={{ fontWeight: "bold" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ background: "#FFFFFF", padding: 2, borderRadius: 2 }}
              >
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    </div>
  );
}
