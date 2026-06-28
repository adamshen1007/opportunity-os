# .ai/00_CONTEXT/ARCHITECTURE_MAP.md


# Architecture Map

Version: 2.0.0

## System Overview

Opportunity OS

Application Platform

▲

│

Intelligence Platform

▲

│

Data Acquisition Framework

Dependencies always flow upward.

Never create reverse dependencies.

## Platform Responsibilities

### Data Acquisition

Responsible for:

- Connectors

- Authentication

- Scheduling

- Raw Content

- Events

Never responsible for:

- AI

- Scoring

- Trends

- Opportunities

### Intelligence

Responsible for:

- Normalization

- AI Workflows

- Clustering

- Trends

- Opportunities

- Scoring

Never responsible for:

- Connector execution

- UI

- Authentication

### Application

Responsible for:

- REST API

- Dashboard

- Authentication

- Reports

Never responsible for:

- AI reasoning

- Scoring

- Data acquisition

## Domain Flow

External Data

↓

Raw Content

↓

Canonical Content

↓

Pain Points

↓

Clusters

↓

Trends

↓

Opportunities

↓

Reports

No shortcuts are permitted.

## Core Aggregates

Connector

↓

RawContent

↓

CanonicalContent

↓

PainPointCluster

↓

Opportunity

Every aggregate has one owner.

Never violate ownership boundaries.
