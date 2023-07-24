import {HttpStatus} from '@nestjs/common';
import {JsonException} from './exception.dto';

export class ApiCauses {
    public static INTERNAL_SERVER_ERROR = new JsonException(
        'Server internal error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR'
    );

    public static INVALID_TOKEN_ADDRESS = new JsonException(
        'Invalid token address',
        HttpStatus.BAD_REQUEST,
        'INVALID_TOKEN_ADDRESS'
    )

    public static TOKEN_ADDRESS_DUPLICATE = new JsonException(
        'Token address duplicate',
        HttpStatus.BAD_REQUEST,
        'TOKEN_ADDRESS_DUPLICATE'
    )

    public static CURRENCY_CONFIG_NOT_FOUND = new JsonException(
        'Currency config not found',
        HttpStatus.BAD_REQUEST,
        'CURRENCY_CONFIG_NOT_FOUND'
    )

    public static TOKEN_OFFCHAIN_NAME_DUPLICATE = new JsonException(
        'Token offchain name duplicate',
        HttpStatus.BAD_REQUEST,
        'TOKEN_OFFCHAIN_NAME_DUPLICATE'
    )

    public static TOKEN_ONCHAIN_NAME_DUPLICATE = new JsonException(
        'Token onchain name duplicate',
        HttpStatus.BAD_REQUEST,
        'TOKEN_ONCHAIN_NAME_DUPLICATE'
    )

    public static TOKEN_API_INCREASE_BALANCE_DUPLICATE = new JsonException(
        'Token api increase balance duplicate',
        HttpStatus.BAD_REQUEST,
        'TOKEN_API_INCREASE_BALANCE_DUPLICATE'
    )

    public static TOKEN_API_GET_BALANCE_DUPLICATE = new JsonException(
        'Token api get balance duplicate',
        HttpStatus.BAD_REQUEST,
        'TOKEN_API_GET_BALANCE_DUPLICATE'
    )

    public static TOKEN_API_VERIFY_REQUEST_DUPLICATE = new JsonException(
        'Token api verify request duplicate',
        HttpStatus.BAD_REQUEST,
        'TOKEN_API_VERIFY_REQUEST_DUPLICATE'
    )

    public static TOKEN_NOT_FOUND = new JsonException(
        'Token not found',
        HttpStatus.BAD_REQUEST,
        'TOKEN_NOT_FOUND'
    )

    public static REDIS_ERROR = new JsonException(
        'Cannot interact with redis server',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'REDIS_ERROR'
    );

    public static NO_CHANGE_PASS = new JsonException(
        'No change password',
        HttpStatus.BAD_REQUEST,
        'NO_CHANGE_PASS'
    );

    public static JWT_NOT_FOUND = new JsonException(
        'JWT not found',
        HttpStatus.BAD_REQUEST,
        'JWT_NOT_FOUND'
    );

    public static NO_USER_BY_WALLET = new JsonException(
        'No user by wallet',
        HttpStatus.BAD_REQUEST,
        'NO_USER_BY_WALLET'
    );

    public static USER_IS_BLACKLIST = new JsonException(
        'User is blacklist',
        HttpStatus.BAD_REQUEST,
        'USER_IS_BLACKLIST'
    );

    public static USER_NOT_ACCESS = new JsonException(
        'User not access',
        HttpStatus.UNAUTHORIZED,
        'USER_NOT_ACCESS'
    );

    public static USER_NOT_FOUND = new JsonException(
        'User not found',
        HttpStatus.BAD_REQUEST,
        'USER_NOT_FOUND'
    );

    public static SIGNATURE_INVALID = new JsonException(
        'Signature invalid',
        HttpStatus.BAD_REQUEST,
        'SIGNATURE_INVALID'
    );

    public static WALLET_INVALID = new JsonException(
        'Wallet invalid',
        HttpStatus.BAD_REQUEST,
        'WALLET_INVALID'
    );

    public static USER_ERROR = new JsonException(
        'User error',
        HttpStatus.BAD_REQUEST,
        'USER_ERROR'
    );

    public static EMAIL_OR_PASSWORD_INVALID = new JsonException(
        'Email or password invalid',
        HttpStatus.BAD_REQUEST,
        'EMAIL_OR_PASSWORD_INVALID'
    );

    public static PHONE_INVALID = new JsonException(
        'Phone invalid',
        HttpStatus.BAD_REQUEST,
        'PHONE_INVALID'
    );

    public static EMAIL_CODE_INVALID = new JsonException(
        'Email code invalid',
        HttpStatus.BAD_REQUEST,
        'EMAIL_CODE_INVALID'
    );

    public static USER_IN_BLACKLIST = new JsonException(
        'User in blacklist',
        HttpStatus.BAD_REQUEST,
        'USER_IN_BLACKLIST'
    );

    public static INVALID_SIGNATURE_WALLET = new JsonException(
        'Invalid signature wallet',
        HttpStatus.BAD_REQUEST,
        'INVALID_SIGNATURE_WALLET'
    );

    public static TWOFA_INVALID = new JsonException(
        'Two factor authentication invalid',
        HttpStatus.BAD_REQUEST,
        'TWOFA_INVALID'
    );

    public static DUPLICATED_EMAIL_OR_USERNAME = new JsonException(
        'Duplicated email or username',
        HttpStatus.BAD_REQUEST,
        'DUPLICATED_EMAIL_OR_USERNAME'
    );

    public static BLOCKCHAIN_IS_NOT_STARTED = new JsonException(
        `blockchain service is not started yet...`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'BLOCKCHAIN_IS_NOT_STARTED'
    );

    public static JWT_EXPIRED = new JsonException(
        'JWT expired',
        HttpStatus.UNAUTHORIZED,
        'JWT_EXPIRED'
    );

    public static TOKEN_INVALID = new JsonException(
        'Token invalid',
        HttpStatus.UNAUTHORIZED,
        'TOKEN_INVALID'
    );

    public static FILE_SIZE_OVER = new JsonException(
        'File size over',
        HttpStatus.BAD_REQUEST,
        'FILE_SIZE_OVER'
    );

    public static FILE_TYPE_INVALID = new JsonException(
        'File type invalid',
        HttpStatus.BAD_REQUEST,
        'FILE_TYPE_INVALID'
    );

    public static NON_RECORDED_USERNAME = new JsonException(
        'This user is not recorded.',
        HttpStatus.UNAUTHORIZED,
        'NON_RECORDED_USERNAME'
    );

    public static PASSWORD_IS_FALSE = new JsonException(
        "The password you entered didn't match our record",
        HttpStatus.BAD_REQUEST,
        'PASSWORD_IS_FALSE'
    );

    public static USER_DONT_HAVE_PERMISSION = new JsonException(
        "You don't have permission to access",
        HttpStatus.UNAUTHORIZED,
        'USER_DONT_HAVE_PERMISSION'
    );

    public static PASSWORD_NOT_MATCH = new JsonException(
        "Password not match",
        HttpStatus.BAD_REQUEST,
        'PASSWORD_NOT_MATCH'
    );

    public static DATA_INVALID = new JsonException(
        "Data invalid",
        HttpStatus.BAD_REQUEST,
        'DATA_INVALID'
    );

    public static AMOUNT_INVALID = new JsonException(
        "Amount invalid",
        HttpStatus.BAD_REQUEST,
        'AMOUNT_INVALID'
    );
    public static DUPLICATE_PASSWORD = new JsonException(
        'The new password cannot be the same as the old password',
        HttpStatus.BAD_REQUEST,
        'DUPLICATE_PASSWORD'
    );
    public static SCHEDULE_FILE_NOT_FOUND = new JsonException(
        'Schedule file not found',
        HttpStatus.BAD_REQUEST,
        'SCHEDULE_FILE_NOT_FOUND'
    );
    public static SCHEDULE_NOT_FOUND = new JsonException(
        'Schedule not found',
        HttpStatus.BAD_REQUEST,
        'SCHEDULE_NOT_FOUND'
    );
    public static KMS_CMK_INVALID = new JsonException(
        'KMS CMK invalid',
        HttpStatus.BAD_REQUEST,
        'KMS_CMK_INVALID'
    );
    public static ONLY_SUPPORT_STRING = new JsonException(
        'Only support string',
        HttpStatus.BAD_REQUEST,
        'ONLY_SUPPORT_STRING'
    );
    public static KMS_DATA_KEY_NOT_FOUND = new JsonException(
        'msg_kms_data_key_not_found',
        HttpStatus.NOT_FOUND, 'KMS_DATA_KEY_NOT_FOUND',
    );
    public static WALLET_WITH_CURRENCY_NOT_CREATED = new JsonException(
        'Wallet with currency not created',
        HttpStatus.BAD_REQUEST,
        'WALLET_WITH_CURRENCY_NOT_CREATED'
    );
    public static ENCRYPT_PRIVATE_KEY_ERROR = new JsonException(
        'Encrypt private key error',
        HttpStatus.BAD_REQUEST,
        'ENCRYPT_PRIVATE_KEY_ERROR'
    );
    public static TOKEN_NOT_SUPPORTED = new JsonException(
        'Token not supported',
        HttpStatus.BAD_REQUEST,
        'TOKEN_NOT_SUPPORTED'
    );
    public static API_NOT_SUPPORTED_TOKEN = new JsonException(
        'Api not supported token',
        HttpStatus.BAD_REQUEST,
        'API_NOT_SUPPORTED_TOKEN'
    );
    public static MISSING_API_URL_OR_KEY = new JsonException(
        'Missing api url or key',
        HttpStatus.BAD_REQUEST,
        'MISSING_API_URL_OR_KEY'
    );
    public static TOKEN_STATUS_NOT_PROVIDED = new JsonException(
        'Token status not provided',
        HttpStatus.BAD_REQUEST,
        'TOKEN_STATUS_NOT_PROVIDED'
    );

    public static CANNOT_BUY_OVER_MAX_USD = (maxUsd) => {
        return new JsonException(
            `Cannot buy over ${maxUsd} USD`,
            HttpStatus.BAD_REQUEST,
            'CANNOT_BUY_OVER_MAX_USD'
        );
    }

    public static SOMETHING_ERROR_WHEN_GET_TOKEN_PRICE = (reason) => new JsonException(
        'Something error when get token price',
        HttpStatus.BAD_REQUEST,
        'SOMETHING_ERROR_WHEN_GET_TOKEN_PRICE',
        reason
    );

    public static PRICE_IS_DIFFERENT_TO_MUCH = (percentage) => new JsonException(
        `Price is different to much, ${percentage}%`,
        HttpStatus.BAD_REQUEST,
        'PRICE_IS_DIFFERENT_TO_MUCH'
    );

    public static PASSWORD_EMPTY = new JsonException(
        'Password cannot be empty',
        HttpStatus.BAD_REQUEST,
        'PASSWORD_EMPTY'
    );

    public static PASSWORD_STRING = new JsonException(
        'Password must be a string',
        HttpStatus.BAD_REQUEST,
        'PASSWORD_STRING'
    );

    public static PASSWORD_MIN_LENGTH = new JsonException(
        'Password must be at least 8 characters long',
        HttpStatus.BAD_REQUEST,
        'PASSWORD_MIN_LENGTH'
    );

    public static PASSWORD_MAX_LENGTH = new JsonException(
        'Password must be at most 20 characters long',
        HttpStatus.BAD_REQUEST,
        'PASSWORD_MAX_LENGTH'
    );

    public static PASSWORD_MATCH_PATTERN = new JsonException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        HttpStatus.BAD_REQUEST,
        'PASSWORD_MATCH_PATTERN'
    );

    public static PASSWORD_INVALID = new JsonException(
        'Password invalid',
        HttpStatus.BAD_REQUEST,
        'PASSWORD_INVALID'
    );

    public static EMAIL_INVALID = new JsonException(
        'Email invalid',
        HttpStatus.BAD_REQUEST,
        'EMAIL_INVALID'
    );

    public static TOKEN_EMPTY = new JsonException(
        'Token cannot be empty',
        HttpStatus.BAD_REQUEST,
        'TOKEN_EMPTY'
    );

    public static TOKEN_STRING = new JsonException(
        'Token must be a string',
        HttpStatus.BAD_REQUEST,
        'TOKEN_STRING'
    );

    public static MAIL_ERROR = new JsonException(
        'Something error when send mail',
        HttpStatus.BAD_REQUEST,
        'MAIL_ERROR'
    );
}