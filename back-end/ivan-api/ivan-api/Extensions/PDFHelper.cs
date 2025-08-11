using PdfSharp.Drawing;
using PdfSharp.Pdf;

namespace ivan_api.Extensions
{
    public class PDFHelper
    {
        private readonly PdfDocument _document;
        private readonly XUnit _topPosition;
        private readonly XUnit _bottomMargin;
        private XUnit _currentPosition;

        public PDFHelper(PdfDocument document, XUnit topPosition, XUnit bottomMargin)
        {
            _document = document;
            _topPosition = topPosition;
            _bottomMargin = bottomMargin;

            //_currentPosition = bottomMargin + 10000;

            CreatePage();
        }

        public XUnit GetLinePosition(XUnit requestedHeight)
        {
            //return GetLinePosition(requestedHeight, -1f);
            return GetLinePosition(requestedHeight, requestedHeight);
        }

        public XUnit GetLinePosition(XUnit requestedHeight, XUnit requiredHeight)
        {
            //XUnit required = requiredHeight == -1f ? requestedHeight : requiredHeight;
            //if (_currentPosition + required > _bottomMargin)
            //    CreatePage();
            //XUnit result = _currentPosition;
            //_currentPosition += requestedHeight;
            //return result;

            if (_currentPosition + requiredHeight > _bottomMargin)
                CreatePage();
            XUnit result = _currentPosition;
            _currentPosition += requestedHeight;
            return result;
        }

        public XGraphics Gfx { get; private set; }
        public PdfPage Page { get; private set; }

        void CreatePage()
        {
            Page = _document.AddPage();
            Page.Size = PdfSharp.PageSize.A4;
            Gfx = XGraphics.FromPdfPage(Page);
            _currentPosition = _topPosition;
        }
    }
}
