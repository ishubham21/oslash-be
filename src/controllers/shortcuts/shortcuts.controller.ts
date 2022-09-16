import { Shortcut } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import {
  GeneralApiResponse,
  ListSortingQueries,
  ServiceError,
  ShortcutData,
  ShortcutVisibility,
} from "../../interfaces";
import ShortcutService from "../../services/shortcuts/shortcut.service";

class ShortcutController {
  private shortcutService;

  constructor () {
    this.shortcutService = new ShortcutService();
  }

  private validateShortcutData = (
    shortcutData: ShortcutData,
  ): ValidationResult => {
    const schema = Joi.object({
      shortlink: Joi.string()
        .trim()
        .required(),
      url: Joi.string()
        .uri()
        .trim()
        .required(),
      visibility: Joi.string()
        .allow("Workspace", "Private")
        .optional(),
      description: Joi.string()
        .trim()
        .optional(),
      tags: Joi.optional(),
    });

    return schema.validate(shortcutData);
  };

  private isUrlWhatwgCompliant = (url: string): boolean => {
    const pattern: RegExp = new RegExp(
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
    );

    return pattern.test(url);
  };

  /**
   * @param req Express request
   * @param res Express response
   */
  public addShortcut = async (req: Request, res: Response) => {
    let shortcutData: ShortcutData = req.body;
    const shortcutTags: string[] | undefined = shortcutData["tags"];
    const visibility: ShortcutVisibility | undefined =
      shortcutData["visibility"];

    /**
     * If tags are not found in the request body, default it to any empty array
     */
    if (!shortcutTags) {
      shortcutData = { ...shortcutData, tags: [] } as ShortcutData;
    }

    /**
     * If visibility is not found in the req body, default it to Workspace
     */
    if (!visibility) {
      shortcutData = {
        ...shortcutData,
        visibility: "Workspace",
      } as ShortcutData;
    }

    const validationError:
      | ValidationError
      | null
      | undefined = this.validateShortcutData(shortcutData).error;

    if (validationError) {
      return res.status(403).json({
        error: validationError.message,
        data: null,
      } as GeneralApiResponse);
    }

    /**
     * If URL is not WHATWG compliant, we return
     */
    if (!this.isUrlWhatwgCompliant(shortcutData.url)) {
      return res.status(406).json({
        error: "This is not a valid URL",
        data: null,
      } as GeneralApiResponse);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: string = req.session!.oslashBeUserId;
    if (!userId) {
      return res.status(406).json({
        error: "You must be logged-in to access this resource",
        data: null,
      } as GeneralApiResponse);
    }

    try {
      /**
       * Trying to add the shortcut in the DB
       */
      const shorturl = await this.shortcutService.addShortcut(
        shortcutData,
        userId,
      );

      return res.status(201).json({
        error: null,
        data: {
          message: `${shorturl} has been added successfully`,
        },
      } as GeneralApiResponse);
    } catch (serviceError) {
      const {
        error,
        code,
      }: ServiceError = serviceError as ServiceError;

      /**
       * Using the response code recieved from ShortcutService
       */
      return res.status(code | 503).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };

  public listShortcuts = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: string = req.session!.oslashBeUserId;

    if (!userId) {
      return res.status(403).json({
        error: "You are not authenticated to use this resource",
        data: null,
      } as GeneralApiResponse);
    }

    const reqQueries: ListSortingQueries = req.query;
    let { orderBy, sortBy } = reqQueries;

    /**
     * if only order by is present
     */
    if (orderBy && !sortBy) {
      return res.status(406).json({
        error: "Please make sure to use sortBy query with orderBy",
        data: null,
      } as GeneralApiResponse);
    }

    /**
     * Defaulting it to shortlink ascending order
     */
    if (!sortBy) {
      sortBy = "shortlink";
    }
    if (!orderBy) {
      orderBy = "asc";
    }

    /**
     * Checking for the correctness of queries
     */
    const allowedSortByValues = [
      "shortlink",
      "createdAt",
      "updatedAt",
      "visits",
    ];
    if (!allowedSortByValues.includes(sortBy)) {
      return res.status(403).json({
        error:
          'Allowed values for sortBy are -> "shortlink", "createdAt", "updatedAt", "visits"',
        data: null,
      } as GeneralApiResponse);
    }

    const allowedOrderByValues = ["asc", "desc"];
    if (!allowedOrderByValues.includes(sortBy)) {
      return res.status(403).json({
        error: 'Allowed values for sortBy are -> "asc" or "desc"',
        data: null,
      } as GeneralApiResponse);
    }

    try {
      const shortcuts:
        | Shortcut[]
        | []
        | null = await this.shortcutService.listShortcuts(
        userId,
        sortBy,
        orderBy,
      );

      return res.status(200).json({
        data: {
          shortcuts,
        },
        error: null,
      } as GeneralApiResponse);
    } catch (serviceError) {
      const {
        error,
        code,
      }: ServiceError = serviceError as ServiceError;

      return res.status(code | 503).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };

  //delete shortcut

  //search shortcuts - based on shortlink, tags, url, etc => latest updated, visits in a range, visibility

  // o/shortlink => should redirect the user to the link they have provided => also increment the visits here
}

export default ShortcutController;
