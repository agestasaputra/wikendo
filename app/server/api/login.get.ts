---
title: Login API endpoint
tags: [auth]
---
import { createSuccessResponse } from 'h3'

export default defineEventHandler(async (event) => {
  return createSuccessResponse({ message: 'Login endpoint active' })
})
---