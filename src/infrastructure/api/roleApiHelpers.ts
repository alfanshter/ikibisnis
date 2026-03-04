/**
 * API Helpers: shared response builders and error handlers for
 * the /api/v1/roles route group.
 */

import { NextResponse } from 'next/server';
import {
  RoleNotFoundError,
  RoleDuplicateNameError,
  RoleValidationError,
  RoleFeatureInvalidError,
} from '@/src/infrastructure/repositories/RoleRepository';

/** Build a successful JSON response envelope. */
export function ok<T>(data: T, path: string, status = 200, message?: string) {
  const defaultMessage =
    status === 201 ? 'Role created successfully' :
    status === 204 ? 'Deleted successfully'       :
                    'Roles retrieved successfully';

  return NextResponse.json(
    {
      success:    true,
      statusCode: status,
      message:    message ?? defaultMessage,
      data,
      timestamp:  new Date().toISOString(),
      path,
    },
    { status }
  );
}

/** Map a thrown error to the correct HTTP response. */
export function handleError(err: unknown, path: string) {
  if (err instanceof RoleNotFoundError) {
    return NextResponse.json(
      { success: false, statusCode: 404, message: err.message, timestamp: new Date().toISOString(), path },
      { status: 404 }
    );
  }
  if (err instanceof RoleDuplicateNameError) {
    return NextResponse.json(
      { success: false, statusCode: 409, message: err.message, timestamp: new Date().toISOString(), path },
      { status: 409 }
    );
  }
  if (err instanceof RoleValidationError) {
    return NextResponse.json(
      { success: false, statusCode: 422, message: err.message, timestamp: new Date().toISOString(), path },
      { status: 422 }
    );
  }
  if (err instanceof RoleFeatureInvalidError) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: err.message, timestamp: new Date().toISOString(), path },
      { status: 400 }
    );
  }
  // UUID format guard
  if (err instanceof Error && err.message.includes('Invalid UUID')) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: err.message, timestamp: new Date().toISOString(), path },
      { status: 400 }
    );
  }
  console.error('[RoleAPI]', err);
  return NextResponse.json(
    { success: false, statusCode: 500, message: 'Internal server error', timestamp: new Date().toISOString(), path },
    { status: 500 }
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Validate UUID format; throws if invalid. */
export function parseUUID(value: string): string {
  if (!UUID_RE.test(value)) {
    throw Object.assign(new Error(`Invalid UUID format: "${value}"`), {});
  }
  return value;
}
