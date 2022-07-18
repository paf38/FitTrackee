import pytest
from flask import Flask

from fittrackee.emails.email import EmailTemplate

from .template_results.email_account_confirmation import (
    expected_en_html_body,
    expected_en_text_body,
    expected_fr_html_body,
    expected_fr_text_body,
)


class TestEmailTemplateForAccountConfirmation:
    EMAIL_DATA = {
        'username': 'test',
        'account_confirmation_url': (
            'http://localhost/account-confirmation?token=xxx'
        ),
        'operating_system': 'Linux',
        'browser_name': 'Firefox',
        'fittrackee_url': 'http://localhost',
    }

    @pytest.mark.parametrize(
        'lang, expected_subject',
        [
            ('en', 'FitTrackee - Confirm your account'),
            ('fr', 'FitTrackee - Confirmer votre inscription'),
        ],
    )
    def test_it_gets_subject(
        self, app: Flask, lang: str, expected_subject: str
    ) -> None:
        email_template = EmailTemplate(
            app.config['TEMPLATES_FOLDER'],
            app.config['TRANSLATIONS_FOLDER'],
            app.config['LANGUAGES'],
        )

        subject = email_template.get_content(
            'account_confirmation', lang, 'subject.txt', {}
        )

        assert subject == expected_subject

    @pytest.mark.parametrize(
        'lang, expected_text_body',
        [
            ('en', expected_en_text_body),
            ('fr', expected_fr_text_body),
        ],
    )
    def test_it_gets_text_body(
        self, app: Flask, lang: str, expected_text_body: str
    ) -> None:
        email_template = EmailTemplate(
            app.config['TEMPLATES_FOLDER'],
            app.config['TRANSLATIONS_FOLDER'],
            app.config['LANGUAGES'],
        )

        text_body = email_template.get_content(
            'account_confirmation', lang, 'body.txt', self.EMAIL_DATA
        )

        assert text_body == expected_text_body

    def test_it_gets_en_html_body(self, app: Flask) -> None:
        email_template = EmailTemplate(
            app.config['TEMPLATES_FOLDER'],
            app.config['TRANSLATIONS_FOLDER'],
            app.config['LANGUAGES'],
        )

        text_body = email_template.get_content(
            'account_confirmation', 'en', 'body.html', self.EMAIL_DATA
        )

        assert expected_en_html_body in text_body

    def test_it_gets_fr_html_body(self, app: Flask) -> None:
        email_template = EmailTemplate(
            app.config['TEMPLATES_FOLDER'],
            app.config['TRANSLATIONS_FOLDER'],
            app.config['LANGUAGES'],
        )

        text_body = email_template.get_content(
            'account_confirmation', 'fr', 'body.html', self.EMAIL_DATA
        )

        assert expected_fr_html_body in text_body
