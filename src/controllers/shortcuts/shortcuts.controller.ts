import { Shortcut } from "@prisma/client";
import { Request, Response } from "express";
import Joi, { ValidationError, ValidationResult } from "joi";
import {
  GeneralApiResponse,
  ListSortingQueries,
  SearchShortcutOptions,
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

  /**
   *
   * @param shortcutData
   * @returns
   */
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

  /**
   *
   * @param url
   * @returns
   */
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
      return res.status(code).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns
   */
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
    if (!allowedOrderByValues.includes(orderBy)) {
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

      return res.status(code).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  public deleteShortcut = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: string = req.session!.oslashBeUserId;

    if (!userId) {
      return res.status(403).json({
        error: "You are not authenticated to use this resource",
        data: null,
      } as GeneralApiResponse);
    }

    const { shortlink } = req.body;

    if (!shortlink) {
      return res.status(406).json({
        error: "Please provide a shortlink to be deleted",
        data: null,
      } as GeneralApiResponse);
    }

    try {
      await this.shortcutService.deleteShortcut(userId, shortlink);

      return res.status(200).json({
        data: `Deleted the shortlink ${shortlink} successfully`,
        error: null,
      } as GeneralApiResponse);
    } catch (serviceError) {
      const {
        error,
        code,
      }: ServiceError = serviceError as ServiceError;

      return res.status(code).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };

  private validateSearchBody = (
    searchOptions: SearchShortcutOptions,
  ): ValidationResult => {
    const schema = Joi.object({
      shortlink: Joi.string().optional(),
      url: Joi.string().optional(),
      visibility: Joi.string()
        .allow("Workspace", "Private")
        .optional(),
      tag: Joi.string().optional(),
      visitsLow: Joi.number().optional(),
      visitsHigh: Joi.number().optional(),
    });

    return schema.validate(searchOptions);
  };

  /**
   *
   * @param req
   * @param res
   * @returns
   */
  public searchShortcuts = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: string = req.session!.oslashBeUserId;

    if (!userId) {
      return res.status(403).json({
        error: "You are not authenticated to use this resource",
        data: null,
      } as GeneralApiResponse);
    }

    /**
     * Will get all the results if no body is provided
     */
    const searchOptions: SearchShortcutOptions = req.body;
    const validationError:
      | ValidationError
      | null
      | undefined = this.validateSearchBody(searchOptions).error;

    if (validationError) {
      return res.status(403).json({
        error: validationError.message,
        data: null,
      } as GeneralApiResponse);
    }

    try {
      const shortcuts:
        | Shortcut[]
        | null = await this.shortcutService.searchShortcuts(
        userId,
        searchOptions,
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

      return res.status(code).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };

  public getUrlFromShortlink = async (
    req: Request,
    res: Response,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const userId: string = req.session!.oslashBeUserId;

    if (!userId) {
      return res.status(403).json({
        error: "You are not authenticated to use this resource",
        data: null,
      } as GeneralApiResponse);
    }

    const { shortlink } = req.params;

    if (!(typeof shortlink === "string")) {
      return res.status(406).json({
        data: null,
        error: "Please pass in a valid URL",
      } as GeneralApiResponse);
    }

    /**
     * Fetching url from shortlink - increment the count
     */
    try {
      const url = await this.shortcutService.getUrlFromShortlink(
        userId,
        shortlink,
      );

      return res.status(200).json({
        data: {
          url,
        },
        error: null,
      } as GeneralApiResponse);
    } catch (serviceError) {
      const {
        error,
        code,
      }: ServiceError = serviceError as ServiceError;

      return res.status(code).json({
        error,
        data: null,
      } as GeneralApiResponse);
    }
  };
}

export default ShortcutController;
