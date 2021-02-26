const {FE_URL} = process.env

exports.oAuthRedirectController= async (req, res, next) => {
try {
    const {accessToken, refreshToken} = req.user.tokens;
    res.cookie("accessToken", accessToken, {httpOnly: true});
    res.cookie("refreshToken", refreshToken, {httpOnly: true, path: "/refreshToken"});;
    res.status(200).redirect(`${FE_URL}`)
} catch (error) {
    console.log(error);
    next(error)
}
}